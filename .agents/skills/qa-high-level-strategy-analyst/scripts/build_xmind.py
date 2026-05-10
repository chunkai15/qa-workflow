#!/usr/bin/env python3
"""Generate an XMind strategy file from a validated tree payload."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
import uuid
import zipfile
from pathlib import Path


REQUIRED_TOP_LEVEL_TITLES = [
    "Objectives",
    "Scope of Testing",
    "Testing Levels",
    "Testing Approaches",
    "Test Data Preparation",
    "Test Environments & Tools",
    "Exit Criteria",
    "Deliverables",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build an XMind test strategy file from a JSON tree payload."
    )
    default_template = (
        Path(__file__).resolve().parent.parent / "assets" / "test-strategy-template.xmind"
    )
    parser.add_argument("--payload", required=True, help="Path to strategy tree JSON payload.")
    parser.add_argument("--output", required=True, help="Output .xmind file path.")
    parser.add_argument(
        "--template",
        default=str(default_template),
        help="Template .xmind file to copy before replacing content.json.",
    )
    parser.add_argument(
        "--skip-contract-validation",
        action="store_true",
        help="Allow generation without enforcing required top-level branch order.",
    )
    return parser.parse_args()


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Payload file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in payload file {path}: {exc}") from exc


def validate_node(node: dict, location: str) -> None:
    title = node.get("title")
    if not isinstance(title, str) or not title.strip():
        raise SystemExit(f"Invalid node title at {location}")
    children = node.get("children", [])
    if children is None:
        return
    if not isinstance(children, list):
        raise SystemExit(f"Invalid children list at {location}")
    for index, child in enumerate(children):
        if not isinstance(child, dict):
            raise SystemExit(f"Child node at {location}[{index}] must be an object")
        validate_node(child, f"{location}/{title}[{index}]")


def validate_payload(payload: dict, enforce_contract: bool) -> None:
    if not isinstance(payload, dict):
        raise SystemExit("Payload root must be a JSON object")
    title = payload.get("title")
    if not isinstance(title, str) or not title.strip():
        raise SystemExit("Payload must include a non-empty 'title'")
    sections = payload.get("sections")
    if not isinstance(sections, list) or not sections:
        raise SystemExit("Payload must include a non-empty 'sections' array")
    for index, section in enumerate(sections):
        if not isinstance(section, dict):
            raise SystemExit(f"Section at index {index} must be an object")
        validate_node(section, f"sections[{index}]")
    if enforce_contract:
        top_titles = [section["title"] for section in sections]
        if top_titles != REQUIRED_TOP_LEVEL_TITLES:
            raise SystemExit(
                "Top-level branch order mismatch.\n"
                f"Expected: {REQUIRED_TOP_LEVEL_TITLES}\n"
                f"Actual:   {top_titles}"
            )


def topic_node(title: str, children: list[dict] | None = None) -> dict:
    node = {
        "id": str(uuid.uuid4()),
        "class": "topic",
        "title": title,
    }
    if children:
        node["children"] = {"attached": children}
    return node


def convert_node(node: dict) -> dict:
    children = [convert_node(child) for child in node.get("children", [])]
    return topic_node(node["title"], children or None)


def build_content(payload: dict) -> list[dict]:
    root_children = [convert_node(section) for section in payload["sections"]]
    root_topic = topic_node(payload["title"], root_children)
    root_topic["structureClass"] = "org.xmind.ui.map.unbalanced"
    root_topic["extensions"] = [
        {
            "provider": "org.xmind.ui.map.unbalanced",
            "content": [{"name": "right-number", "content": "3"}],
        }
    ]
    return [
        {
            "id": str(uuid.uuid4()),
            "revisionId": str(uuid.uuid4()),
            "class": "sheet",
            "rootTopic": root_topic,
        }
    ]


def rebuild_xmind(template_path: Path, output_path: Path, content: list[dict]) -> None:
    if not template_path.exists():
        raise SystemExit(f"Template file not found: {template_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="xmind-build-") as temp_dir:
        temp_dir_path = Path(temp_dir)
        extracted_dir = temp_dir_path / "template"
        extracted_dir.mkdir()

        with zipfile.ZipFile(template_path, "r") as source_zip:
            source_zip.extractall(extracted_dir)

        content_path = extracted_dir / "content.json"
        content_path.write_text(
            json.dumps(content, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        metadata_path = extracted_dir / "metadata.json"
        if metadata_path.exists():
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            creator = metadata.setdefault("creator", {})
            creator["name"] = "Codex"
            creator["version"] = "qa-high-level-strategy-analyst"
            metadata_path.write_text(
                json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )

        temp_output = temp_dir_path / "output.xmind"
        with zipfile.ZipFile(temp_output, "w", compression=zipfile.ZIP_DEFLATED) as target_zip:
            for file_path in sorted(extracted_dir.rglob("*")):
                if file_path.is_file():
                    target_zip.write(file_path, file_path.relative_to(extracted_dir))

        shutil.move(str(temp_output), output_path)


def main() -> int:
    args = parse_args()
    payload_path = Path(args.payload).resolve()
    template_path = Path(args.template).resolve()
    output_path = Path(args.output).resolve()

    payload = load_json(payload_path)
    validate_payload(payload, enforce_contract=not args.skip_contract_validation)
    content = build_content(payload)
    rebuild_xmind(template_path, output_path, content)
    print(f"[OK] Wrote XMind strategy file: {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
