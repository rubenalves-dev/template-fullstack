package service

import (
	"context"
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

func (a authService) Login(ctx context.Context, email, password string) (string, error) {
	u, err := a.repo.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, httputil.ErrNotFound) {
			return "", httputil.ErrUnauthorized // Don't reveal user existence
		}
		return "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return "", httputil.ErrUnauthorized
	}

	claims := domain.UserClaims{
		UserID: u.ID.String(),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   u.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(a.jwtSecret))
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
