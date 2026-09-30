'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler } from '@/lib/api/client';
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  hasExpiredStoredToken,
  saveSession,
  SessionUser,
  subscribeSession,
  tokenExpiresAt,
} from '@/lib/auth/session-store';

type User = SessionUser;

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

const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // La sesión vive en localStorage: se lee como store externo (sin copiarla a estado en un efecto)
  const session = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
  // En el servidor y durante la hidratación todavía no se sabe si hay sesión
  const isHydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const token = session?.token ?? null;
  const user = session?.user ?? null;

  const logout = useCallback(() => {
    clearSession();
  }, []);

  // Sesión vencida: se cierra y se avisa en el login
  const expireSession = useCallback(() => {
    clearSession();
    router.replace('/login?expired=1');
  }, [router]);

  // Al abrir la app con un token vencido guardado: se limpia y se avisa
  useEffect(() => {
    if (hasExpiredStoredToken()) expireSession();
  }, [expireSession]);

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
    saveSession({ token: data.accessToken, user: data.user });
  }

  async function register(email: string, password: string, name: string) {
    await api.post<RegisterResponse>('/auth/register', { email, password, name });
    await login(email, password);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading: !isHydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
