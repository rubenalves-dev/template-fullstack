package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Repository defines an interface for managing user data storage and retrieval operations in the system.
type Repository interface {
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, userID uuid.UUID) (*User, error)
	CreateUser(ctx context.Context, user *User) error

	// Sessions
	CreateSession(ctx context.Context, session *Session) error
	GetSessionByID(ctx context.Context, sessionID uuid.UUID) (*Session, error)
	UpdateSessionRefresh(ctx context.Context, sessionID uuid.UUID, refreshTokenHash string, expiresAt time.Time) error

	// RBAC
	UpsertPermissions(ctx context.Context, permissions []Permission) error
	CreateRole(ctx context.Context, name string) (*Role, error)
	GetRoles(ctx context.Context) ([]Role, error)
	AssignRoleToUser(ctx context.Context, userID uuid.UUID, roleID int) error
	GetUserPermissions(ctx context.Context, userID uuid.UUID) ([]string, error)
	AddPermissionToRole(ctx context.Context, roleID int, permissionID string) error

	// Menu definitions
	UpsertMenuDefinitions(ctx context.Context, defs []MenuDefinition) error
	GetMenuDefinitions(ctx context.Context) ([]MenuDefinition, error)
}

// Service defines an interface for managing user authentication and registration operations in the system.
type Service interface {
	Login(ctx context.Context, email, password string) (AuthTokens, error)
	RefreshTokens(ctx context.Context, refreshToken string) (AuthTokens, error)
	GetMe(ctx context.Context, userID uuid.UUID) (*User, error)
	Register(ctx context.Context, user User) error

	// RBAC
	RegisterModulePermissions(ctx context.Context, module string, permissions []string) error
	RegisterModuleMenus(ctx context.Context, domain string, defs []MenuDefinition) error
	CreateRole(ctx context.Context, name string) (*Role, error)
	GetRoles(ctx context.Context) ([]Role, error)
	AssignRole(ctx context.Context, userID uuid.UUID, roleID int) error
	GetMyMenu(ctx context.Context, userID uuid.UUID) ([]MenuNode, error)
	AddPermissionToRole(ctx context.Context, roleID int, permissionID string) error
}
