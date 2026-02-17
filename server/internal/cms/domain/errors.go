package domain

import (
	"errors"
)

var (
	ErrPageNotFound      = errors.New("page not found")
	ErrInvalidPageStatus = errors.New("invalid page status")
	ErrPageAlreadyExists = errors.New("page already exists")
)
