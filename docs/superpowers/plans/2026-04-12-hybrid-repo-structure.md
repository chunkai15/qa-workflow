# Hybrid Repo Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a feature-centric hybrid workspace structure without breaking the existing automation pipeline layout.

**Architecture:** Keep `src/` and `.agents/skills/` as the workflow engine, then add `features/`, `knowledge/`, `templates/`, and `intake/` as the content model around it. Preserve legacy `input/` and `output/` for compatibility while shifting repo conventions toward per-feature automation folders.

**Tech Stack:** TypeScript, Markdown, JSON/YAML-style metadata conventions

---

### Task 1: Establish repo-level structure

**Files:**
- Modify: `AGENTS.md`
- Create: `docs/architecture/repo-structure.md`
- Create: `docs/conventions/working-model.md`
- Create: `docs/how-to/add-new-feature.md`

- [ ] Define the hybrid workspace rules and preferred paths.
- [ ] Document how feature folders, knowledge, templates, and intake should be used.
- [ ] Preserve compatibility guidance for legacy `input/` and `output/`.

### Task 2: Add reusable feature templates

**Files:**
- Create: `templates/feature/README.template.md`
- Create: `templates/feature/feature.yaml.template`
- Create: `templates/feature/sources.template.md`
- Create: `templates/feature/feature-folder.tree.md`

- [ ] Add a minimal but complete feature package template.
- [ ] Make the template readable by both humans and future skills.

### Task 3: Seed repo-level navigation

**Files:**
- Create: `features/_index/feature-catalog.md`
- Create: `features/_index/tags.md`
- Create: `features/_index/status-board.md`
- Create: `knowledge/README.md`
- Create: `templates/README.md`
- Create: `intake/README.md`

- [ ] Add navigation placeholders so the new structure is usable immediately.
- [ ] Clarify what belongs in each top-level content area.

### Task 4: Verify the documentation update

**Files:**
- Check: `AGENTS.md`
- Check: `docs/architecture/repo-structure.md`

- [ ] Review the new paths for consistency with current repo constraints.
- [ ] Confirm no build/test-sensitive source files were changed.
