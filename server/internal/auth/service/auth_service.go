package service

import (
	"context"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"log/slog"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
	"github.com/rubenalves-dev/template-fullstack/server/internal/auth/domain"
	"github.com/rubenalves-dev/template-fullstack/server/pkg/httputil"
	"golang.org/x/crypto/bcrypt"
)

type authService struct {
	repo      domain.Repository
	nc        *nats.Conn
	jwtSecret string
}

func NewAuthService(repository domain.Repository, nc *nats.Conn, jwtSecret string) domain.Service {
	return &authService{
		repo:      repository,
		nc:        nc,
		jwtSecret: jwtSecret,
	}
}

const (
	accessTokenTTL  = 15 * time.Minute
	refreshTokenTTL = 7 * 24 * time.Hour
)

func (a authService) Login(ctx context.Context, email, password string) (domain.AuthTokens, error) {
	u, err := a.repo.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, httputil.ErrNotFound) {
			return domain.AuthTokens{}, httputil.ErrUnauthorized // Don't reveal user existence
		}
		return domain.AuthTokens{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}

	sessionID := uuid.New()
	now := time.Now()
	accessExpires := now.Add(accessTokenTTL)
	refreshExpires := now.Add(refreshTokenTTL)

	accessToken, err := a.signToken(u.ID, sessionID, domain.TokenTypeAccess, accessExpires)
	if err != nil {
		return domain.AuthTokens{}, err
	}
	refreshToken, err := a.signToken(u.ID, sessionID, domain.TokenTypeRefresh, refreshExpires)
	if err != nil {
		return domain.AuthTokens{}, err
	}

	session := &domain.Session{
		ID:               sessionID,
		UserID:           u.ID,
		RefreshTokenHash: hashToken(refreshToken),
		ExpiresAt:        refreshExpires,
	}
	if err := a.repo.CreateSession(ctx, session); err != nil {
		return domain.AuthTokens{}, err
	}

	return domain.AuthTokens{
		AccessToken:      accessToken,
		RefreshToken:     refreshToken,
		AccessExpiresAt:  accessExpires,
		RefreshExpiresAt: refreshExpires,
	}, nil
}

func (a authService) RefreshTokens(ctx context.Context, refreshToken string) (domain.AuthTokens, error) {
	claims := &domain.UserClaims{}
	token, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (any, error) {
		return []byte(a.jwtSecret), nil
	})
	if err != nil || !token.Valid || claims.TokenType != domain.TokenTypeRefresh {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}

	userID, err := uuid.Parse(claims.UserID)
	if err != nil {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}
	sessionID, err := uuid.Parse(claims.SessionID)
	if err != nil {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}

	session, err := a.repo.GetSessionByID(ctx, sessionID)
	if err != nil {
		if errors.Is(err, httputil.ErrNotFound) {
			return domain.AuthTokens{}, httputil.ErrUnauthorized
		}
		return domain.AuthTokens{}, err
	}

	if session.UserID != userID || session.RevokedAt != nil || time.Now().After(session.ExpiresAt) {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}

	if !hashMatches(refreshToken, session.RefreshTokenHash) {
		return domain.AuthTokens{}, httputil.ErrUnauthorized
	}

	now := time.Now()
	accessExpires := now.Add(accessTokenTTL)
	refreshExpires := now.Add(refreshTokenTTL)

	newAccessToken, err := a.signToken(userID, sessionID, domain.TokenTypeAccess, accessExpires)
	if err != nil {
		return domain.AuthTokens{}, err
	}
	newRefreshToken, err := a.signToken(userID, sessionID, domain.TokenTypeRefresh, refreshExpires)
	if err != nil {
		return domain.AuthTokens{}, err
	}

	if err := a.repo.UpdateSessionRefresh(ctx, sessionID, hashToken(newRefreshToken), refreshExpires); err != nil {
		return domain.AuthTokens{}, err
	}

	return domain.AuthTokens{
		AccessToken:      newAccessToken,
		RefreshToken:     newRefreshToken,
		AccessExpiresAt:  accessExpires,
		RefreshExpiresAt: refreshExpires,
	}, nil
}

func (a authService) GetMe(ctx context.Context, userID uuid.UUID) (*domain.User, error) {
	return a.repo.GetUserByID(ctx, userID)
}

func (a authService) Register(ctx context.Context, user domain.User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hashedPassword)
	return a.repo.CreateUser(ctx, &user)
}

func (a authService) RegisterModulePermissions(ctx context.Context, module string, permissions []string) error {
	var perms []domain.Permission
	for _, p := range permissions {
		perms = append(perms, domain.Permission{
			ID:     p,
			Module: module,
		})
	}
	return a.repo.UpsertPermissions(ctx, perms)
}

func (a authService) RegisterModuleMenus(ctx context.Context, domainName string, defs []domain.MenuDefinition) error {
	for i := range defs {
		defs[i].Domain = domainName
	}
	err := a.repo.UpsertMenuDefinitions(ctx, defs)
	if err != nil {
		slog.Error("failed to register module menus", "domain", domainName, "error", err)
		return err
	}
	slog.Info("module menus registered", "domain", domainName, "count", len(defs))
	return nil
}

func (a authService) CreateRole(ctx context.Context, name string) (*domain.Role, error) {
	return a.repo.CreateRole(ctx, name)
}

func (a authService) GetRoles(ctx context.Context) ([]domain.Role, error) {
	return a.repo.GetRoles(ctx)
}

func (a authService) AssignRole(ctx context.Context, userID uuid.UUID, roleID int) error {
	return a.repo.AssignRoleToUser(ctx, userID, roleID)
}

func (a authService) AddPermissionToRole(ctx context.Context, roleID int, permissionID string) error {
	return a.repo.AddPermissionToRole(ctx, roleID, permissionID)
}

func (a authService) GetMyMenu(ctx context.Context, userID uuid.UUID) ([]domain.MenuNode, error) {
	perms, err := a.repo.GetUserPermissions(ctx, userID)
	if err != nil {
		return nil, err
	}

	permMap := make(map[string]bool)
	for _, p := range perms {
		permMap[p] = true
	}

	defs, err := a.repo.GetMenuDefinitions(ctx)
	if err != nil {
		return nil, err
	}

	return buildMenuTree(defs, permMap), nil
}

func (a authService) signToken(userID uuid.UUID, sessionID uuid.UUID, tokenType domain.TokenType, expiresAt time.Time) (string, error) {
	claims := domain.UserClaims{
		UserID:    userID.String(),
		SessionID: sessionID.String(),
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(a.jwtSecret))
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

func hashMatches(token string, expectedHash string) bool {
	computed := hashToken(token)
	return subtle.ConstantTimeCompare([]byte(computed), []byte(expectedHash)) == 1
}
