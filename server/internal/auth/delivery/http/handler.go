package http

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/domain"
	"github.com/rubenalves-dev/template-fullstack/server/pkg/httputil"
	"github.com/rubenalves-dev/template-fullstack/server/pkg/jsonutil"
)

type AuthHandler struct {
	svc domain.Service
}

func RegisterHTTPHandlers(r *chi.Mux, svc domain.Service) {
	h := &AuthHandler{svc: svc}

	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", h.Login)
		r.Post("/refresh", h.Refresh)
		r.Post("/register", h.Register)
	})
}

func RegisterProtectedHTTPHandlers(r chi.Router, svc domain.Service) {
	h := &AuthHandler{svc: svc}

	r.Get("/me", h.GetMe)

	r.Route("/backoffice", func(r chi.Router) {
		r.Get("/me/menu", h.GetMyMenu)
		r.Get("/roles", h.GetRoles)
		r.Post("/roles", h.CreateRole)
		r.Post("/roles/{roleID}/permissions", h.AddPermissionToRole)
		r.Post("/users/{userID}/roles", h.AssignRoleToUser)
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonutil.RenderError(w, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body")
		return
	}

	tokens, err := h.svc.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		status, code := httputil.MapError(err)
		jsonutil.RenderError(w, status, code, err.Error())
		return
	}

	h.setTokenCookies(w, tokens)
	jsonutil.RenderJSON(w, http.StatusOK, loginResponse{
		AccessToken:      tokens.AccessToken,
		RefreshToken:     tokens.RefreshToken,
		AccessExpiresAt:  tokens.AccessExpiresAt.Format(time.RFC3339),
		RefreshExpiresAt: tokens.RefreshExpiresAt.Format(time.RFC3339),
	})
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonutil.RenderError(w, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body")
		return
	}

	tokens, err := h.svc.RefreshTokens(r.Context(), req.RefreshToken)
	if err != nil {
		status, code := httputil.MapError(err)
		jsonutil.RenderError(w, status, code, err.Error())
		return
	}

	h.setTokenCookies(w, tokens)
	jsonutil.RenderJSON(w, http.StatusOK, loginResponse{
		AccessToken:      tokens.AccessToken,
		RefreshToken:     tokens.RefreshToken,
		AccessExpiresAt:  tokens.AccessExpiresAt.Format(time.RFC3339),
		RefreshExpiresAt: tokens.RefreshExpiresAt.Format(time.RFC3339),
	})
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonutil.RenderError(w, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body")
		return
	}

	err := h.svc.Register(r.Context(), domain.User{
		Email:        req.Email,
		PasswordHash: req.Password,
		FullName:     req.FullName,
	})

	if err != nil {
		status, code := httputil.MapError(err)
		jsonutil.RenderError(w, status, code, err.Error())
		return
	}

	jsonutil.RenderJSON(w, http.StatusCreated, map[string]string{"message": "User registered successfully"})
}

func (h *AuthHandler) setTokenCookies(w http.ResponseWriter, tokens domain.AuthTokens) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    tokens.RefreshToken,
		Expires:  tokens.RefreshExpiresAt,
		Path:     "/",   // Crucial: cookie must be available for all API paths
		HttpOnly: true,  // Essential: Prevents JS from stealing the token
		Secure:   false, // Only send over HTTPS
		//SameSite: http.SameSiteLaxMode, // CSRF protection
	})
}
