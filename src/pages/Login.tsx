import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/Toast'

type Mode = 'login' | 'register' | 'reset'

export function Login() {
  const { user, signIn, signUp, resetPassword } = useAuth()
  const { showToast } = useToast()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error)
    } else if (mode === 'register') {
      const { error } = await signUp(email, password, name)
      if (error) setError(error)
      else showToast('Cuenta creada. Revisa tu correo para confirmar.')
    } else {
      const { error } = await resetPassword(email)
      if (error) setError(error)
      else {
        showToast('Te enviamos un correo para restablecer tu contraseña.')
        setMode('login')
      }
    }
    setLoading(false)
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        {mode !== 'reset' && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
          />
        )}

        {error && <p className="text-sm text-rose-deep">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60">
          {loading
            ? 'Un momento…'
            : mode === 'login'
              ? 'Entrar'
              : mode === 'register'
                ? 'Crear cuenta'
                : 'Enviar enlace'}
        </button>

        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-ink-soft dark:text-blush/50">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => setMode('reset')} className="underline">
                Olvidé mi contraseña
              </button>
              <button type="button" onClick={() => setMode('register')} className="underline">
                Crear una cuenta nueva
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button type="button" onClick={() => setMode('login')} className="underline">
              Volver a iniciar sesión
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  )
}
