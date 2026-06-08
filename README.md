### Hexlet tests and linter status:
[![Actions Status](https://github.com/algins/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/algins/ai-for-developers-project-387/actions)

## Project Overview

This repository contains:

- API contract in TypeSpec (`main.tsp`)
- generated OpenAPI spec (`tsp-output/schema/openapi.yaml`)
- separate frontend app (`frontend/`) built against the API contract
- separate backend app (`backend/`) built with Spring Boot (in-memory storage)

All common workflows are encapsulated in the root `Makefile`.

### Requirements

- Node.js 22 LTS or newer
- npm
- Java 17+
- Gradle 8+

## Quick Start

1. Install all dependencies:

```bash
make setup
```

2. Start frontend (Vite):

```bash
make frontend-start
```

Backend can be started separately:

```bash
make backend-start
```

3. Open the app in browser:

- http://localhost:5173/

## Development Workflow

### 1) Setup

Run full project setup (root deps, API docs, frontend setup/build, backend build):

```bash
make setup
```

### 2) API Contract Work

Compile TypeSpec once:

```bash
make api-docs
```

Generate frontend API types:

```bash
make frontend-types
```

Run full frontend preparation (install, types, build):

```bash
make frontend-setup
```

### 3) Run the App

Run frontend without Prism:

```bash
make frontend-start
```

Run frontend with Prism mock:

```bash
make frontend-start-dev
```

### 4) See Results in Browser

When `make frontend-start` or `make frontend-start-dev` is running, open:

- http://localhost:5173/

Main routes:

- Public flow: `/`
- Event booking page: `/event-types/:eventTypeId`
- Public slots API: `/slots`
- Admin owner: `/owner/profile`
- Admin event types: `/admin/event-types`
- Admin bookings: `/admin/bookings`

Backend API (when `make backend-start` is running):

- http://localhost:4010

### 5) Make Changes

Typical loop while editing contract + frontend:

1. Edit `main.tsp` (or frontend code in `frontend/src`).
2. Rebuild contract and frontend types:

```bash
make api-docs
make frontend-types
```

3. Keep app running with:

```bash
make frontend-start
```

4. Refresh browser and verify behavior.

### 6) Validate Before Commit

Run frontend lint and typecheck:

```bash
make frontend-lint
make frontend-typecheck
```

Run frontend integration scenarios (Playwright):

```bash
make frontend-e2e
```

Run backend lint and tests:

```bash
make backend-lint
make backend-test
```

## Environment

Frontend environment template:

- `frontend/.env.example`

Main variable:

- `VITE_API_BASE_URL` (default in local setup: `http://localhost:4010`)

## Useful Commands

Install dependencies:

```bash
make setup
```

Run only frontend setup/build:

```bash
make frontend-setup
```

Run only backend build:

```bash
make backend-setup
```

Build artifacts:

```bash
make api-docs
make frontend-build
make backend-build
```

Generated OpenAPI files are written to `tsp-output/schema/`.

## Docker

The repository uses a single `Dockerfile` that builds frontend and backend, then runs one Spring Boot container.

Build image from the repository root:

```bash
docker build -t calendar-booking-app .
```

Run container and pass port through `PORT` environment variable:

```bash
docker run --rm -e PORT=4010 -p 4010:4010 calendar-booking-app
```

When the container starts:

- Spring Boot starts automatically and listens on `PORT`
- frontend static files are served by the same app on `/`
- API is available on the same host/port (same-origin)

## Deployment

This is a demo application and does not have a permanent deployed URL.