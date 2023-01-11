.PHONY:
dev:
	docker compose -f compose.yml -f compose-dev.yml up

.PHONY:
dev-clean:
	docker compose -f compose.yml -f compose-dev.yml up --build --force-recreate

.PHONY:
dev-stop:
	docker compose -f compose.yml -f compose-dev.yml down

# Deletes all volumes that don't have any container running (database)
.PHONY:
prune:
	docker volume prune

