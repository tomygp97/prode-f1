import { api } from "./client"

export interface Me {
    id: string
    email: string
    name: string
    isAppAdmin: boolean // admin de la APP (los devs), no de una liga
}

export interface PasswordResetLink {
    url: string
    expiresAt: string
    userName: string
}

export function fetchMe(token: string): Promise<Me> {
    return api.get<Me>("/auth/me", token)
}

export function changePassword(token: string, body: { currentPassword: string; newPassword: string }): Promise<void> {
    return api.patch<void>("/auth/password", body, token)
}

// Pública: el token viene en el link que generó un admin
export function resetPassword(body: { token: string; newPassword: string }): Promise<void> {
    return api.post<void>("/auth/reset-password", body)
}

// Solo admins de la app
export function createPasswordResetLink(token: string, email: string): Promise<PasswordResetLink> {
    return api.post<PasswordResetLink>("/admin/password-reset-links", { email }, token)
}
