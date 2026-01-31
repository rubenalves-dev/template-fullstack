include .env
export

.PHONY: test test-coverage lint build watch sqlc-gen migration-status migration-up migration-down migration-create db-create db-drop

test:
	go test ./... -v

test-coverage:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out

lint:
	golangci-lint run

build:
	go build -o bin/api cmd/api/main.go

watch:
	@if command -v air > /dev/null; then \
	    air; \
	else \
	    echo "Air is not installed. Please install it with: go install github.com/air-verse/air@latest"; \
	fi

sqlc-gen:
	sqlc generate

migration-status:
	goose -dir internal/infrastructure/persistence/postgres/migrations postgres "$(DB_CONN_STRING)" status

migration-up:
	goose -dir internal/infrastructure/persistence/postgres/migrations postgres "$(DB_CONN_STRING)" up

migration-down:
	goose -dir internal/infrastructure/persistence/postgres/migrations postgres "$(DB_CONN_STRING)" down

migration-create:
	goose -dir internal/infrastructure/persistence/postgres/migrations postgres "$(DB_CONN_STRING)" create $(name) sql

db-create:
	psql -h localhost -U postgres -c "CREATE DATABASE \"template-fullstack\";"

db-drop:
	psql -h localhost -U postgres -c "DROP DATABASE \"template-fullstack\";"
