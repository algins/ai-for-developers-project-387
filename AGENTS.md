# AGENTS Guide

This file is for coding agents working in this repository.
Prefer these instructions over generic defaults.

## Scope And Sources

- Checked instruction sources: no existing `AGENTS.md` or `.github/copilot-instructions.md` in this repo.
- Project docs to consult first:
  - [README.md](README.md)

## Project Shape

- Contract-first API definition in [main.tsp](main.tsp).
- Generated OpenAPI spec in [tsp-output/schema/openapi.yaml](tsp-output/schema/openapi.yaml).
- Frontend app in [frontend/](frontend/) (React + TypeScript + Vite).
- Backend app in [backend/](backend/) (Spring Boot, in-memory storage).
- Shared workflows are centralized in [Makefile](Makefile).

## Fast Start Commands

Use `make` targets first.

- Setup all parts: `make setup`
- Regenerate OpenAPI from TypeSpec: `make api-docs`
- Regenerate frontend API types: `make frontend-types`
- Frontend dev server: `make frontend-start`
- Frontend dev + Prism mock: `make frontend-start-dev`
- Backend dev server: `make backend-start`
- Frontend lint/typecheck: `make frontend-lint` and `make frontend-typecheck`
- Backend lint/tests: `make backend-lint` and `make backend-test`

## Architecture Boundaries

- Treat [main.tsp](main.tsp) as the source of truth for API shapes.
- Backend package flow is controller -> service -> repository; keep business logic out of controllers.
- Frontend should consume generated API types from [frontend/src/types/api.generated.ts](frontend/src/types/api.generated.ts).
- Reuse existing API/query helpers instead of adding parallel clients.

## Generated Files Rules

- Do not hand-edit generated OpenAPI in [tsp-output/schema/openapi.yaml](tsp-output/schema/openapi.yaml).
- Do not hand-edit generated frontend types in [frontend/src/types/api.generated.ts](frontend/src/types/api.generated.ts).
- If contract changes:
  1. Run `make api-docs`
  2. Run `make frontend-types`

## Conventions That Matter

- Backend tests use Spring MVC test + Mockito style and JSON assertions.
- Frontend uses strict TypeScript and ESLint; prefer fixing root causes over type casts.
- Keep changes focused; avoid broad refactors unless explicitly requested.

## Environment Pitfalls

- Node.js 22+ is required by TypeSpec toolchain.
- This environment may not have `rg`; use available search tools if missing.
- shadcn can occasionally scaffold into `frontend/@/...`; move files into `frontend/src/...` if that occurs.
- Backend storage is in-memory; state resets when app restarts.

## Agent Workflow

- Before editing, read nearby files to match existing style.
- Prefer the smallest viable diff.
- After changes, run the narrowest relevant checks first.
- For cross-layer changes (contract + frontend/backend), regenerate artifacts before finishing.
- If touching commands or workflows, keep [README.md](README.md) up to date.
