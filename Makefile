.PHONY:
dev:
	docker compose -f compose.yml -f compose-dev.yml up

.PHONY:
dev-clean:
	docker compose -f compose.yml -f compose-dev.yml up --build --force-recreate

.PHONY:
dev-stop:
	docker compose -f compose.yml -f compose-dev.yml down

.PHONY:
dev-restart:
	docker compose -f compose.yml -f compose-dev.yml restart

.PHONY:
prod:
	docker compose -f compose.yml -f compose-prod.yml up

.PHONY:
prod-stop:
	docker compose -f compose.yml -f compose-prod.yml down

.PHONY:
prod-restart:
	docker compose -f compose.yml -f compose-prod.yml restart

.PHONY:
prod-clean:
	docker compose -f compose.yml -f compose-prod.yml up --build --force-recreate

.PHONY:
build:
	cd client; npm run build

# Deletes all volumes that don't have any container running (database)
.PHONY:
prune:
	docker volume prune

