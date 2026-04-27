#!/usr/bin/env python3

import argparse
import datetime as dt
import json
import shutil
import sqlite3
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(
        description="Migrate Codex thread provider metadata in SQLite and session JSONL files."
    )
    parser.add_argument("--codex-home", default=str(Path.home() / ".codex"))
    parser.add_argument("--from-provider", required=True)
    parser.add_argument("--to-provider", required=True)
    parser.add_argument("--cwd")
    parser.add_argument("--include-archived", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def backup_file(path: Path, stamp: str) -> Path:
    backup = path.with_name(f"{path.name}.bak-{stamp}")
    shutil.copy2(path, backup)
    return backup


def load_target_threads(db_path: Path, from_provider: str, cwd: str | None, include_archived: bool):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        where = ["model_provider = ?"]
        params = [from_provider]
        if cwd:
            where.append("cwd = ?")
            params.append(cwd)
        if not include_archived:
            where.append("archived = 0")
        sql = f"""
            select id, title, rollout_path, model_provider, cwd, archived
            from threads
            where {" and ".join(where)}
            order by updated_at_ms desc, id desc
        """
        rows = conn.execute(sql, params).fetchall()
        return conn, rows
    except Exception:
        conn.close()
        raise


def rewrite_session_provider(session_path: Path, from_provider: str, to_provider: str, dry_run: bool):
    lines = session_path.read_text(encoding="utf-8").splitlines()
    changed = False
    for idx, line in enumerate(lines):
        obj = json.loads(line)
        if obj.get("type") != "session_meta":
            continue
        payload = obj.get("payload", {})
        if payload.get("model_provider") != from_provider:
            break
        payload["model_provider"] = to_provider
        lines[idx] = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
        changed = True
        break
    if changed and not dry_run:
        session_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return changed


def main():
    args = parse_args()
    codex_home = Path(args.codex_home).expanduser().resolve()
    db_path = codex_home / "state_5.sqlite"
    if not db_path.exists():
        raise SystemExit(f"Missing SQLite DB: {db_path}")

    conn, rows = load_target_threads(
        db_path=db_path,
        from_provider=args.from_provider,
        cwd=args.cwd,
        include_archived=args.include_archived,
    )

    if not rows:
        print("No matching threads found.")
        conn.close()
        return

    print(f"Found {len(rows)} thread(s) to migrate from {args.from_provider} to {args.to_provider}.")
    for row in rows[:10]:
        print(f"- {row['id']} | archived={row['archived']} | {row['title'][:100]}")
    if len(rows) > 10:
        print(f"... and {len(rows) - 10} more")

    session_paths = [Path(row["rollout_path"]) for row in rows]
    missing_sessions = [str(path) for path in session_paths if not path.exists()]
    if missing_sessions:
        print("Missing session files:")
        for path in missing_sessions:
            print(f"- {path}")
        conn.close()
        raise SystemExit(1)

    if args.dry_run:
        changed_sessions = sum(
            1 for path in session_paths
            if rewrite_session_provider(path, args.from_provider, args.to_provider, dry_run=True)
        )
        print(f"Dry run only. SQLite rows to update: {len(rows)}")
        print(f"Dry run only. Session files to update: {changed_sessions}")
        conn.close()
        return

    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    db_backup = backup_file(db_path, stamp)
    wal_path = db_path.with_name(f"{db_path.name}-wal")
    shm_path = db_path.with_name(f"{db_path.name}-shm")
    wal_backup = backup_file(wal_path, stamp) if wal_path.exists() else None
    shm_backup = backup_file(shm_path, stamp) if shm_path.exists() else None

    changed_session_paths = []
    session_backups = {}
    try:
        conn.execute("begin")
        conn.executemany(
            "update threads set model_provider = ? where id = ?",
            [(args.to_provider, row["id"]) for row in rows],
        )
        conn.commit()

        for path in session_paths:
            session_backups[path] = backup_file(path, stamp)
            if rewrite_session_provider(path, args.from_provider, args.to_provider, dry_run=False):
                changed_session_paths.append(path)

    except Exception:
        conn.rollback()
        shutil.copy2(db_backup, db_path)
        if wal_backup and wal_path.exists():
            shutil.copy2(wal_backup, wal_path)
        if shm_backup and shm_path.exists():
            shutil.copy2(shm_backup, shm_path)
        for path, backup in session_backups.items():
            if backup.exists():
                shutil.copy2(backup, path)
        conn.close()
        raise

    conn.close()
    print(f"Updated SQLite rows: {len(rows)}")
    print(f"Updated session files: {len(changed_session_paths)}")
    print(f"SQLite backup: {db_backup}")
    if wal_backup:
        print(f"SQLite WAL backup: {wal_backup}")
    if shm_backup:
        print(f"SQLite SHM backup: {shm_backup}")
    print("Session backups:")
    for path in changed_session_paths[:10]:
        print(f"- {session_backups[path]}")
    if len(changed_session_paths) > 10:
        print(f"... and {len(changed_session_paths) - 10} more session backups")


if __name__ == "__main__":
    main()
