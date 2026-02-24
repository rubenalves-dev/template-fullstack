package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth"
	authHttp "github.com/rubenalves-dev/template-fullstack/server/internal/auth/delivery/http"
	"github.com/rubenalves-dev/template-fullstack/server/internal/cms"
	"github.com/rubenalves-dev/template-fullstack/server/internal/platform"
	"github.com/rubenalves-dev/template-fullstack/server/pkg/jsonutil"
)

func main() {
	cfg, err := platform.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)
	logger.Info("starting application", "env", cfg.Env, "port", cfg.Port)

	dbPool, err := platform.NewPostgresDatabase(cfg.DBConnString)
	if err != nil {
		logger.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer dbPool.Close()
	logger.Info("connected to database")

	nc, err := platform.NewNatsConnection(cfg.NatsURL)
	if err != nil {
		logger.Error("failed to connect to NATS", "error", err)
		os.Exit(1)
	}
	defer nc.Close()
	logger.Info("connected to NATS")

	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	corsPtr := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Adjust as needed
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})
	//corsPtr := cors.AllowAll()

	router.Use(corsPtr.Handler)

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		jsonutil.RenderJSON(w, http.StatusOK, map[string]string{"status": "OK"})
	})

	// Auth Module
	authModule := auth.NewModule(dbPool, nc, cfg.JWTSecret)
	authModule.RegisterRoutes(router)

	// Microservices
	cmsModule := cms.NewModule(dbPool, nc)

	// Protected routes modules
	router.Group(func(r chi.Router) {
		r.Use(authHttp.AuthMiddleware(cfg.JWTSecret))

		authModule.RegisterProtectedRoutes(r)
		cmsModule.RegisterRoutes(r)
	})

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: router,
	}

	// Graceful Shutdown
	go func() {
		if err := server.ListenAndServeTLS("cert.pem", "key.pem"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	logger.Info("server started")

	// Wait for an interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Error("server forced to shutdown", "error", err)
		os.Exit(1)
	}
	logger.Info("server exited properly")
}
