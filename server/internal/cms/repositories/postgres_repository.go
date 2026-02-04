package repositories

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/domain"
)

type pxgRepo struct {
	pool *pgxpool.Pool
}

func NewPgxRepository(pool *pgxpool.Pool) domain.Repository {
	return &pxgRepo{pool: pool}
}

func (p pxgRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Page, error) {
	query := `SELECT id, title, slug, seo_description, seo_keywords, status, created_at, updated_at FROM pages WHERE id = $1`
	row := p.pool.QueryRow(ctx, query, id)

	var page domain.Page
	err := row.Scan(&page.ID, &page.Title, &page.Slug, &page.SEODescription, &page.SEOKeywords, &page.Status, &page.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &page, nil
}

func (p pxgRepo) GetBySlug(ctx context.Context, slug string) (*domain.Page, error) {
	query := `SELECT id, title, slug, seo_description, seo_keywords, status, created_at, updated_at FROM pages WHERE slug = $1`
	row := p.pool.QueryRow(ctx, query, slug)

	var page domain.Page
	err := row.Scan(&page.ID, &page.Title, &page.Slug, &page.SEODescription, &page.SEOKeywords, &page.Status, &page.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &page, nil
}

func (p pxgRepo) List(ctx context.Context) ([]domain.Page, error) {
	query := `SELECT id, title, slug, seo_description, seo_keywords, status, created_at, updated_at FROM pages ORDER BY created_at DESC`
	rows, err := p.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var pages []domain.Page
	for rows.Next() {
		var page domain.Page
		err := rows.Scan(&page.ID, &page.Title, &page.Slug, &page.SEODescription, &page.SEOKeywords, &page.Status, &page.UpdatedAt)
		if err != nil {
			return nil, err
		}
		pages = append(pages, page)
	}
	return pages, nil
}

func (p pxgRepo) Create(ctx context.Context, page *domain.Page) error {
	query := `INSERT INTO pages (id, title, slug, seo_description, seo_keywords, status) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := p.pool.Exec(ctx, query, page.ID, page.Title, page.Slug, page.SEODescription, page.SEOKeywords, page.Status)
	return err
}

func (p pxgRepo) Update(ctx context.Context, page *domain.Page) error {
	query := `UPDATE pages SET title = $1, slug = $2, seo_description = $3, seo_keywords = $4, status = $5, updated_at = NOW() WHERE id = $6`
	_, err := p.pool.Exec(ctx, query, page.Title, page.Slug, page.SEODescription, page.SEOKeywords, page.Status, page.ID)
	return err
}

func (p pxgRepo) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM pages WHERE id = $1`
	_, err := p.pool.Exec(ctx, query, id)
	return err
}

func (p pxgRepo) SaveLayout(ctx context.Context, pageID uuid.UUID, rows []domain.Row) error {
	tx, err := p.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func(tx pgx.Tx, ctx context.Context) {
		err := tx.Rollback(ctx)
		if err != nil {
			return
		}
	}(tx, ctx)

	query := `DELETE FROM rows WHERE page_id = $1`
	_, err = tx.Exec(ctx, query, pageID)
	if err != nil {
		return err
	}

	for _, row := range rows {
		query := "INSERT INTO rows (page_id, order_index, css_class, background_config) VALUES ($1, $2, $3, $4) RETURNING id"

		var rowID uuid.UUID
		r := tx.QueryRow(ctx, query, pageID, row.OrderIndex, row.CSSClass, row.BackgroundConfig)
		err := r.Scan(&rowID)
		if err != nil {
			return err
		}

		for _, col := range row.Columns {
			var colID uuid.UUID
			err = tx.QueryRow(ctx, "INSERT INTO columns (row_id, order_index, css_class, width_sm, width_md, width_lg, width_xl) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
				rowID, col.OrderIndex, col.CSSClass, col.WidthSM, col.WidthMD, col.WidthLG, col.WidthXL).Scan(&colID)
			if err != nil {
				return err
			}

			for _, block := range col.Blocks {
				contentJSON, _ := json.Marshal(block.Content)
				_, err = tx.Exec(ctx, "INSERT INTO blocks (column_id, type, content) VALUES ($1, $2, $3)", colID, block.Type, contentJSON)
				if err != nil {
					return err
				}
			}
		}
	}

	return tx.Commit(ctx)
}

func (p pxgRepo) GetFullLayout(ctx context.Context, pageID uuid.UUID) ([]domain.Row, error) {
	// 1. Get Rows
	rowsQuery := `SELECT id, page_id, order_index, css_class, background_config FROM rows WHERE page_id = $1 ORDER BY order_index ASC`
	dbRows, err := p.pool.Query(ctx, rowsQuery, pageID)
	if err != nil {
		return nil, err
	}
	defer dbRows.Close()

	var rows []domain.Row
	rowIDs := make([]uuid.UUID, 0)
	rowMap := make(map[uuid.UUID]*domain.Row)

	for dbRows.Next() {
		var r domain.Row
		err := dbRows.Scan(&r.ID, &r.PageID, &r.OrderIndex, &r.CSSClass, &r.BackgroundConfig)
		if err != nil {
			return nil, err
		}
		r.Columns = []domain.Column{}
		rows = append(rows, r)
		rowIDs = append(rowIDs, r.ID)
		rowMap[r.ID] = &rows[len(rows)-1]
	}

	if len(rows) == 0 {
		return rows, nil
	}

	// 2. Get Columns
	colsQuery := `SELECT id, row_id, order_index, css_class, width_sm, width_md, width_lg, width_xl FROM columns WHERE row_id = ANY($1) ORDER BY order_index ASC`
	dbCols, err := p.pool.Query(ctx, colsQuery, rowIDs)
	if err != nil {
		return nil, err
	}
	defer dbCols.Close()

	colIDs := make([]uuid.UUID, 0)
	colMap := make(map[uuid.UUID]*domain.Column)

	for dbCols.Next() {
		var c domain.Column
		err := dbCols.Scan(&c.ID, &c.RowID, &c.OrderIndex, &c.CSSClass, &c.WidthSM, &c.WidthMD, &c.WidthLG, &c.WidthXL)
		if err != nil {
			return nil, err
		}
		c.Blocks = []domain.Block{}

		if parentRow, ok := rowMap[c.RowID]; ok {
			parentRow.Columns = append(parentRow.Columns, c)
			colIDs = append(colIDs, c.ID)
			colMap[c.ID] = &parentRow.Columns[len(parentRow.Columns)-1]
		}
	}

	if len(colIDs) == 0 {
		return rows, nil
	}

	// 3. Get Blocks
	blocksQuery := `SELECT id, column_id, type, order_index, is_hidden, content FROM blocks WHERE column_id = ANY($1) ORDER BY order_index ASC`
	dbBlocks, err := p.pool.Query(ctx, blocksQuery, colIDs)
	if err != nil {
		return nil, err
	}
	defer dbBlocks.Close()

	for dbBlocks.Next() {
		var b domain.Block
		var contentJSON []byte
		err := dbBlocks.Scan(&b.ID, &b.ColumnID, &b.Type, &b.OrderIndex, &b.IsHidden, &contentJSON)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal(contentJSON, &b.Content); err != nil {
			return nil, err
		}

		if parentCol, ok := colMap[b.ColumnID]; ok {
			parentCol.Blocks = append(parentCol.Blocks, b)
		}
	}

	return rows, nil
}

func (p pxgRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `UPDATE pages SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := p.pool.Exec(ctx, query, status, id)
	return err
}
