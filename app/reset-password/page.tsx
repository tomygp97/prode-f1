'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth';
import { passwordErrorMessage, validateNewPassword } from '@/lib/auth/password';
import { PasswordInput } from '@/components/auth/password-input';

const inputClass =
  'w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500';

// /reset-password?token=...: link de un solo uso que genera un admin de la app (lo manda por WhatsApp)
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const token = typeof params.token === 'string' ? params.token : '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const invalid = validateNewPassword(password, repeat);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword({ token, newPassword: password });
      router.replace('/login?reset=1');
    } catch (err) {
      setError(passwordErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      {!token ? (
        <div className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
          <h1 className="text-xl font-semibold text-white">Link incompleto</h1>
          <p className="text-sm text-neutral-400">
            Abrí el link completo que te mandó el admin. Si no funciona, pedile uno nuevo.
          </p>
          <Link href="/login" className="inline-block text-sm text-white underline">
            Ir a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Nueva contraseña</h1>
            <p className="mt-1 text-sm text-neutral-400">Elegí la contraseña con la que vas a ingresar.</p>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm text-neutral-400">Nueva contraseña</label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="repeat-password" className="text-sm text-neutral-400">Repetí la contraseña</label>
            <PasswordInput
              id="repeat-password"
              autoComplete="new-password"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white py-2 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Guardando…
              </>
            ) : (
              'Guardar contraseña'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
