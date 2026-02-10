package domain

import "github.com/golang-jwt/jwt/v5"

type ContextKey string

const UserClaimsKey ContextKey = "user_claims"

type TokenType string

const (
	TokenTypeAccess  TokenType = "access"
	TokenTypeRefresh TokenType = "refresh"
)

// UserClaims represents the claims of a JWT token issued to a user.
type UserClaims struct {
	UserID    string
	SessionID string
	TokenType TokenType
	jwt.RegisteredClaims
}
