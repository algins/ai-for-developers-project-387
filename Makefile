setup: install api-docs frontend-setup backend-setup

install:
	npm install

api-docs:
	npx tsp compile .

frontend-setup: frontend-install frontend-types frontend-build

frontend-install:
	cd frontend && npm install

frontend-types:
	cd frontend && npm run generate:types

frontend-build:
	cd frontend && npm run build

frontend-e2e:
	cd frontend && npm run e2e

frontend-lint:
	cd frontend && npm run lint

frontend-typecheck:
	cd frontend && npm run typecheck

frontend-start:
	cd frontend && npm run dev

frontend-start-dev:
	cd frontend && npm run dev:with-mock

backend-setup: backend-build

backend-build:
	cd backend && gradle build

backend-lint:
	cd backend && gradle checkstyleMain checkstyleTest

backend-test:
	cd backend && gradle test

backend-start:
	cd backend && gradle bootRun
