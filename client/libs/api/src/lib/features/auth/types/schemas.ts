export interface AuthSession {
    accessToken: string;
    accessExpiresAt: string;
    refreshToken?: string;
    refreshExpiresAt?: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    roles?: Role[];
    created_at?: string;
    updated_at?: string;
}

export type Menu = {
    id: string;
    // domain: string;
    label: string;
    path?: string;
    icon?: string;
    // order?: number;
    // parentId?: string;
    // permissions?: string[];
    // visible: boolean;
    children?: Menu[];
};
