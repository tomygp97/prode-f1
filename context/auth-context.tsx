'use client';

import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Vencimiento del JWT (claim `exp`, en segundos) en ms; null si no se puede leer
function tokenExpiresAt(token: string): number | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStoredSession();
  }, []);

  // Sesión vencida: se cierra y se avisa en el login
  const expireSession = useCallback(() => {
    logout();
    router.replace('/login?expired=1');
  }, [logout, router]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const expiresAt = storedToken ? tokenExpiresAt(storedToken) : null;

    if (storedToken && storedUser && (expiresAt === null || expiresAt > Date.now())) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else if (storedToken) {
      clearStoredSession();
      router.replace('/login?expired=1');
    }
    setIsLoading(false);
  }, [router]);

  // Cualquier 401 del back con token cierra la sesión
  useEffect(() => {
    setUnauthorizedHandler(expireSession);
    return () => setUnauthorizedHandler(null);
  }, [expireSession]);

  // Con la app abierta, se cierra justo cuando vence el token
  useEffect(() => {
    if (!token) return;
    const expiresAt = tokenExpiresAt(token);
    if (expiresAt === null) return;
    const timer = setTimeout(expireSession, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [token, expireSession]);

  async function login(email: string, password: string) {
    const data = await api.post<LoginResponse>('/auth/login', { email, password });
    setToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  async function register(email: string, password: string, name: string) {
    await api.post<RegisterResponse>('/auth/register', { email, password, name });
    await login(email, password);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
