package domain

import "github.com/google/uuid"

// PageUpdateRequest handles SEO and Title updates
type PageUpdateRequest struct {
	Title          *string  `json:"title"`
	Slug           *string  `json:"slug"`
	SEODescription *string  `json:"seo_description"`
	Keywords       []string `json:"keywords"`
}

// CreatePageRequest handles initial page creation
type CreatePageRequest struct {
	Title      string `json:"title"`
	PageType   string `json:"page_type"` // Static or Dynamic
	IsEditable bool   `json:"is_editable"`
}

type RegisterStaticPageRequest struct {
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	IsEditable bool   `json:"is_editable"`
}

// RowRequest handles layout updates
type RowRequest struct {
	ID               *uuid.UUID      `json:"id"` // If null, create new
	SortOrder        int             `json:"sort_order"`
	CSSClass         string          `json:"css_class"`
	BackgroundConfig map[string]any  `json:"background_config"`
	Columns          []ColumnRequest `json:"columns"`
}

// ColumnRequest handles column updates
type ColumnRequest struct {
	CSSClass string         `json:"css_class"`
	WidthSM  string         `json:"width_sm"`
	WidthMD  string         `json:"width_md"`
	WidthLG  string         `json:"width_lg"`
	WidthXL  string         `json:"width_xl"`
	Blocks   []BlockRequest `json:"blocks"`
}

// BlockRequest handles block updates
type BlockRequest struct {
	Type    string                 `json:"type"`
	Content map[string]interface{} `json:"content"`
}
