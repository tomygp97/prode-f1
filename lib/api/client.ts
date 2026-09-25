const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

interface ApiErrorBody {
  message: string | string[];
  error: string;
  statusCode: number;
}

export class ApiRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Lo registra AuthProvider: cierra la sesión y manda al login
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  // 401 con token = sesión vencida o inválida (un login fallido no manda token)
  if (response.status === 401 && token) {
    unauthorizedHandler?.();
    throw new ApiRequestError('Tu sesión expiró. Volvé a ingresar.', 401);
  }

  if (!response.ok) {
    const errorBody = data as ApiErrorBody | null;
    const message = errorBody?.message
      ? Array.isArray(errorBody.message) ? errorBody.message.join(', ') : errorBody.message
      : 'Algo salió mal';
    throw new ApiRequestError(message, response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: 'GET' }, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),
};