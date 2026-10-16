// Reglas y mensajes de contraseña compartidos por registro, restablecer y cambiar contraseña
export const MIN_PASSWORD_LENGTH = 6

/** Error de validación en castellano, o null si la nueva contraseña está bien. */
export function validateNewPassword(password: string, repeat: string): string | null {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }
    if (password !== repeat) return "Las contraseñas no coinciden."
    return null
}

const backendMessages: Record<string, string> = {
    "Invalid or expired link": "El link no es válido o ya venció. Pedile uno nuevo al admin.",
    "Current password is incorrect": "La contraseña actual no es correcta.",
    "New password must be different": "La nueva contraseña tiene que ser distinta de la actual.",
    "User not found": "No hay ningún usuario con ese email.",
}

// Mensajes del back y del navegador → castellano (el resto se muestra tal cual)
export function passwordErrorMessage(err: unknown): string {
    // fetch tira TypeError cuando no hay conexión o el servidor no responde
    if (err instanceof TypeError) return "No se pudo conectar con el servidor. Probá de nuevo en un momento."
    if (!(err instanceof Error)) return "Algo salió mal. Probá de nuevo."
    if (/at least \d+ characters|longer than or equal to/.test(err.message)) {
        return `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }
    return backendMessages[err.message] ?? err.message
}
