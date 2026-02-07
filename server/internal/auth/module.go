package auth

import (
	"context"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/delivery/events"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/delivery/http"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/domain"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/repositories"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/service"
)

type AuthModule struct {
	Service domain.Service
}

func NewModule(pool *pgxpool.Pool, nc *nats.Conn, jwtSecret string) *AuthModule {
	repo := repositories.NewPgxRepository(pool)
	svc := service.NewAuthService(repo, nc, jwtSecret)

	events.RegisterListeners(nc, svc)

	// Register Auth Permissions
	// We use a background context here as this is startup logic
	go func() {
		_ = svc.RegisterModulePermissions(context.Background(), "auth", domain.GetAvailablePermissions())
		_ = svc.RegisterModuleMenus(context.Background(), "auth", MenuDefinitions)
	}()

	return &AuthModule{Service: svc}
}

func (m *AuthModule) RegisterRoutes(r *chi.Mux) {
	http.RegisterHTTPHandlers(r, m.Service)
}

func (m *AuthModule) RegisterProtectedRoutes(r chi.Router) {
	http.RegisterProtectedHTTPHandlers(r, m.Service)
}
