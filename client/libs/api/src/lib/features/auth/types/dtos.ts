export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface RefreshRequest {
  refresh_token?: string;
}

export interface AuthTokensResponse {
  access_token: string;
  refresh_token?: string;
  access_expires_at: string;
  refresh_expires_at?: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface AddPermissionRequest {
  permission_id: string;
}

export interface AssignRoleRequest {
  role_id: number;
}
