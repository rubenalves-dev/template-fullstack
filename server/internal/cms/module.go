package cms

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/delivery/events"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/delivery/http"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/domain"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/repositories"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms/services"
)

type CmsModule struct {
	Service domain.Service
}

func NewModule(pool *pgxpool.Pool, nc *nats.Conn) *CmsModule {
	repo := repositories.NewPgxRepository(pool)
	svc := services.NewService(repo, nc)

	events.RegisterListeners(nc, svc)

	return &CmsModule{Service: svc}
}

func (m *CmsModule) RegisterRoutes(r chi.Router) {
	http.RegisterHTTPHandlers(r, m.Service)
}
