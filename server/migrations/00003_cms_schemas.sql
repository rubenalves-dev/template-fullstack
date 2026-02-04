-- +goose Up
-- +goose StatementBegin

CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    seo_description TEXT,
    seo_keywords TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK ( status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE rows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,

    css_class VARCHAR(255),
    background_config JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    row_id UUID REFERENCES rows(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,

    css_class VARCHAR(255),
    width_sm VARCHAR(20) DEFAULT '12',
    width_md VARCHAR(20) DEFAULT '6',
    width_lg VARCHAR(20) DEFAULT '4',
    width_xl VARCHAR(20) DEFAULT 'auto'
);

CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,

    content JSONB DEFAULT '{}'::jsonb
);

---
-- Performance Indexes
---
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_rows_page_id ON rows(page_id);
CREATE INDEX idx_columns_row_id ON columns(row_id);
CREATE INDEX idx_blocks_column_id ON blocks(column_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin



-- +goose StatementEnd
