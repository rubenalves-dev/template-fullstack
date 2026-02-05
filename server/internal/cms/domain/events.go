package domain

import "github.com/google/uuid"

const (
	EventPagePublished = "cms.page.published"
)

type PagePublishedEvent struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
	Slug   string    `json:"slug"`
}
