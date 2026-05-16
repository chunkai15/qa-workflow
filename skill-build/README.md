# Skill Build

## Purpose
This directory contains the source code, builders, or scripts used to generate, compile, and maintain the skills in the `.agents/skills/` directory.

## `.agents/skills/` vs `skill-build/`
- **`.agents/skills/`**: This is the **output** directory. It contains the finalized, compiled `SKILL.md` files that agents actually read and execute.
- **`skill-build/`**: This is the **working** directory for developers/harness engineers who are writing or updating skills. 

> **Agent Note:** Do not read skills from `skill-build/`. Always load your instructions from `.agents/skills/{skill-name}/SKILL.md`.
