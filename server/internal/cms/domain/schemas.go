package domain

import (
	"time"

	"github.com/google/uuid"
)

type Page struct {
	ID             uuid.UUID `json:"id"`
	Title          string    `json:"title"`
	Slug           string    `json:"slug"`
	SEODescription string    `json:"seo_description"`
	SEOKeywords    []string  `json:"seo_keywords"`
	Status         string    `json:"status"`

	PageType   string `json:"page_type"` // Static or Dynamic
	IsEditable bool   `json:"is_editable"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Rows []Row `json:"rows,omitempty"`
}

type Row struct {
	ID               uuid.UUID      `json:"id"`
	PageID           uuid.UUID      `json:"page_id"`
	OrderIndex       int            `json:"order_index"`
	CSSClass         string         `json:"css_class"`
	BackgroundConfig map[string]any `json:"background_config"`

	Columns []Column `json:"columns,omitempty"`
}

type Column struct {
	ID         uuid.UUID `json:"id"`
	RowID      uuid.UUID `json:"row_id"`
	OrderIndex int       `json:"order_index"`
	CSSClass   string    `json:"css_class"`
	WidthSM    string    `json:"width_sm"`
	WidthMD    string    `json:"width_md"`
	WidthLG    string    `json:"width_lg"`
	WidthXL    string    `json:"width_xl"`

	Blocks []Block `json:"blocks,omitempty"`
}

type Block struct {
	ID         uuid.UUID      `json:"id"`
	ColumnID   uuid.UUID      `json:"column_id"`
	Type       string         `json:"type"`
	OrderIndex int            `json:"order_index"`
	IsHidden   bool           `json:"is_hidden"`
	Content    map[string]any `json:"content"`
}
