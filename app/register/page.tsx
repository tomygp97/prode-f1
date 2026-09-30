'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { ApiRequestError } from '@/lib/api/client';
import { isInviteLink, safeNextPath, withNext } from '@/lib/auth/redirect';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // /register?next=/leagues?code=ABC123: después de crear la cuenta se vuelve ahí
  const next = safeNextPath(use(searchParams).next);
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      router.replace(next ?? '/');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'No se pudo conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-xl font-semibold text-white">Crear cuenta</h1>

        {isInviteLink(next) && !error && (
          <p className="rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-300">
            Te invitaron a una liga: creá tu cuenta y te llevamos directo a unirte.
          </p>
        )}
        {error && <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-400">{error}</p>}

        <div className="space-y-1">
          <label className="text-sm text-neutral-400">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-neutral-400">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-white py-2 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-neutral-400">
          ¿Ya tenés cuenta?{' '}
          <Link href={withNext('/login', next)} className="text-white underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}