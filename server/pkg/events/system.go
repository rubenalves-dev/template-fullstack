package events

import (
	"github.com/rubenalves-dev/template-fullstack/server/internal/platform/menu"
)

const (
	SystemPermissionsRegister = "system.permissions.register"
	SystemMenusRegister       = "system.menus.register"
)

type SystemPermissionsRegisteredData struct {
	Module      string   `json:"module"`
	Permissions []string `json:"permissions"`
}

type SystemMenusRegisteredData struct {
	Domain  string                `json:"domain"`
	Version int                   `json:"version"`
	Menu    []menu.MenuDefinition `json:"menu"`
}
