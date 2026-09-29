import { useMemo } from 'react'
import type { Session } from '../types'
import { API_BASE_URL } from '../api'

type Props = {
  session: Session | null
  onClearSession: () => void
}

export function Header({ session, onClearSession }: Props) {
  const tokenPreview = useMemo(() => {
    if (!session?.token) return ''
    const t = session.token
    return t.length > 36 ? `${t.slice(0, 18)}…${t.slice(-12)}` : t
  }, [session])

  const apiLabel = API_BASE_URL || 'same origin (/api)'

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">E-Com Services</span>
        <h1>API Tester</h1>
        <p>
          Hit every gateway route — auth, products, and orders — against{' '}
          <code>{apiLabel}</code>.
        </p>
      </div>
      <div className="session">
        <div className={`session-pill ${session ? 'authed' : ''}`}>
          <span className="dot" />
          {session ? `${session.username} · ${session.role}` : 'Not authenticated'}
        </div>
        {session && <div className="token-preview">{tokenPreview}</div>}
        {session && (
          <button type="button" className="btn ghost" onClick={onClearSession}>
            Clear token
          </button>
        )}
      </div>
    </header>
  )
}
