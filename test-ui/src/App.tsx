import { useState } from 'react'
import { apiRequest, type ApiResult } from './api'
import { AuthTab } from './components/AuthTab'
import { Header } from './components/Header'
import { OrdersTab } from './components/OrdersTab'
import { ProductsTab } from './components/ProductsTab'
import { ResponsePanel } from './components/ResponsePanel'
import type { RunFn, Session, Tab } from './types'
import './index.css'

function App() {
  const [tab, setTab] = useState<Tab>('auth')
  const [session, setSession] = useState<Session | null>(() => {
    const raw = localStorage.getItem('ecom-session')
    if (!raw) return null
    try {
      return JSON.parse(raw) as Session
    } catch {
      return null
    }
  })
  const [result, setResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastCall, setLastCall] = useState('')

  function persistSession(next: Session | null) {
    setSession(next)
    if (next) localStorage.setItem('ecom-session', JSON.stringify(next))
    else localStorage.removeItem('ecom-session')
  }

  const run: RunFn = async (_label, path, options = {}) => {
    setLoading(true)
    setLastCall(`${options.method ?? 'GET'} ${path}`)
    try {
      const res = await apiRequest(path, {
        ...options,
        token: options.token === undefined ? session?.token : options.token,
      })
      setResult(res)

      const body = res.body as Record<string, unknown> | null
      if (
        res.ok &&
        body &&
        typeof body === 'object' &&
        typeof body.token === 'string' &&
        (path.includes('/login') || path.includes('/register'))
      ) {
        persistSession({
          token: body.token,
          username: String(body.username ?? ''),
          role: String(body.role ?? 'USER'),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header session={session} onClearSession={() => persistSession(null)} />

      <div className="layout">
        <section className="panel">
          <div className="tabs" role="tablist">
            {(
              [
                ['auth', 'Auth'],
                ['products', 'Products'],
                ['orders', 'Orders'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="panel-body">
            {tab === 'auth' && <AuthTab loading={loading} run={run} />}
            {tab === 'products' && <ProductsTab loading={loading} run={run} />}
            {tab === 'orders' && <OrdersTab loading={loading} run={run} />}
          </div>
        </section>

        <ResponsePanel result={result} lastCall={lastCall} loading={loading} />
      </div>

      <p className="footer-note">
        In production, set <code>VITE_API_BASE_URL</code> to your gateway URL.
        Locally, the Vite proxy forwards <code>/api</code> → gateway{' '}
        <code>:8080</code>.
      </p>
    </div>
  )
}

export default App
