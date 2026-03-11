package events

import "github.com/google/uuid"

const (
	CmsPagePublished     = "cms.page.published"
	CmsPageDrafted       = "cms.page.drafted"
	CmsPageDeleted       = "cms.page.deleted"
	CmsPageArchived      = "cms.page.archived"
	CmsPageLayoutUpdated = "cms.page.layout.updated"
)

type CmsPagePublishedData struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
	Slug   string    `json:"slug"`
}
type CmsPageDraftedData struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
	Slug   string    `json:"slug"`
}

type CmsPageDeletedData struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
}

type CmsPageArchivedData struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
	Slug   string    `json:"slug"`
}

type CmsPageLayoutUpdatedData struct {
	PageID uuid.UUID `json:"page_id"`
	Title  string    `json:"title"`
	Slug   string    `json:"slug"`
}
