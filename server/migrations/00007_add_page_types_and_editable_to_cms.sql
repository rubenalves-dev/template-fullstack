-- +goose Up
-- +goose StatementBegin
ALTER TABLE pages
    ADD COLUMN page_type VARCHAR(50) NOT NULL DEFAULT 'dynamic' CHECK (page_type IN ('static', 'dynamic')),
    ADD COLUMN is_editable BOOLEAN NOT NULL DEFAULT true;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE pages
    DROP COLUMN page_type,
    DROP COLUMN is_editable;
-- +goose StatementEnd
