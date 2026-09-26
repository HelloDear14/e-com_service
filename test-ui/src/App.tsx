import { FormEvent, useMemo, useState } from 'react'
import { apiRequest, type ApiResult } from './api'
import './index.css'

type Tab = 'auth' | 'products' | 'orders'

type Session = {
  token: string
  username: string
  role: string
}

const emptyResult: ApiResult | null = null

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
  const [result, setResult] = useState<ApiResult | null>(emptyResult)
  const [loading, setLoading] = useState(false)
  const [lastCall, setLastCall] = useState<string>('')

  // Auth forms
  const [reg, setReg] = useState({
    username: 'alice',
    email: 'alice@example.com',
    password: 'secret12',
  })
  const [login, setLogin] = useState({ username: 'alice', password: 'secret12' })

  // Products
  const [categoryFilter, setCategoryFilter] = useState('')
  const [productId, setProductId] = useState('1')
  const [productForm, setProductForm] = useState({
    name: 'Keyboard',
    description: 'Mechanical',
    price: '79.99',
    stock: '25',
    category: 'Electronics',
  })
  const [reserveQty, setReserveQty] = useState('1')

  // Orders
  const [orderId, setOrderId] = useState('1')
  const [orderItems, setOrderItems] = useState([{ productId: '1', quantity: '1' }])

  const tokenPreview = useMemo(() => {
    if (!session?.token) return ''
    const t = session.token
    return t.length > 36 ? `${t.slice(0, 18)}…${t.slice(-12)}` : t
  }, [session])

  function persistSession(next: Session | null) {
    setSession(next)
    if (next) localStorage.setItem('ecom-session', JSON.stringify(next))
    else localStorage.removeItem('ecom-session')
  }

  async function run(
    label: string,
    path: string,
    options: Parameters<typeof apiRequest>[1] = {},
  ) {
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

  function onRegister(e: FormEvent) {
    e.preventDefault()
    void run('Register', '/api/auth/register', {
      method: 'POST',
      body: reg,
      token: null,
    })
  }

  function onLogin(e: FormEvent) {
    e.preventDefault()
    void run('Login', '/api/auth/login', {
      method: 'POST',
      body: login,
      token: null,
    })
  }

  function productPayload() {
    return {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category: productForm.category,
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-mark">E-Com Services</span>
          <h1>API Tester</h1>
          <p>
            Hit every gateway route — auth, products, and orders — against{' '}
            <code>localhost:8080</code>.
          </p>
        </div>
        <div className="session">
          <div className={`session-pill ${session ? 'authed' : ''}`}>
            <span className="dot" />
            {session
              ? `${session.username} · ${session.role}`
              : 'Not authenticated'}
          </div>
          {session && <div className="token-preview">{tokenPreview}</div>}
          {session && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => persistSession(null)}
            >
              Clear token
            </button>
          )}
        </div>
      </header>

      <div className="layout">
        <section className="panel">
          <div className="tabs" role="tablist">
            {([
              ['auth', 'Auth'],
              ['products', 'Products'],
              ['orders', 'Orders'],
            ] as const).map(([id, label]) => (
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
            {tab === 'auth' && (
              <>
                <form className="section" onSubmit={onRegister}>
                  <div className="section-head">
                    <h2>Register</h2>
                    <span className="method">POST /api/auth/register</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Username
                      <input
                        value={reg.username}
                        onChange={(e) =>
                          setReg((s) => ({ ...s, username: e.target.value }))
                        }
                        required
                        minLength={3}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={reg.email}
                        onChange={(e) =>
                          setReg((s) => ({ ...s, email: e.target.value }))
                        }
                        required
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={reg.password}
                        onChange={(e) =>
                          setReg((s) => ({ ...s, password: e.target.value }))
                        }
                        required
                        minLength={6}
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button className="btn primary" type="submit" disabled={loading}>
                      Register
                    </button>
                  </div>
                  <p className="hint">Public · stores JWT on success</p>
                </form>

                <form className="section" onSubmit={onLogin}>
                  <div className="section-head">
                    <h2>Login</h2>
                    <span className="method">POST /api/auth/login</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Username
                      <input
                        value={login.username}
                        onChange={(e) =>
                          setLogin((s) => ({ ...s, username: e.target.value }))
                        }
                        required
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={login.password}
                        onChange={(e) =>
                          setLogin((s) => ({ ...s, password: e.target.value }))
                        }
                        required
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button className="btn primary" type="submit" disabled={loading}>
                      Login
                    </button>
                  </div>
                  <p className="hint">Public · stores JWT on success</p>
                </form>
              </>
            )}

            {tab === 'products' && (
              <>
                <div className="section">
                  <div className="section-head">
                    <h2>List products</h2>
                    <span className="method get">GET /api/products</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Category (optional)
                      <input
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        placeholder="Electronics"
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={loading}
                      onClick={() => {
                        const q = categoryFilter.trim()
                          ? `?category=${encodeURIComponent(categoryFilter.trim())}`
                          : ''
                        void run('List', `/api/products${q}`, { token: null })
                      }}
                    >
                      List
                    </button>
                  </div>
                  <p className="hint">Public</p>
                </div>

                <div className="section">
                  <div className="section-head">
                    <h2>Get product</h2>
                    <span className="method get">GET /api/products/:id</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Product ID
                      <input
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={loading}
                      onClick={() =>
                        void run('Get', `/api/products/${productId}`, {
                          token: null,
                        })
                      }
                    >
                      Fetch
                    </button>
                  </div>
                </div>

                <form
                  className="section"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void run('Create', '/api/products', {
                      method: 'POST',
                      body: productPayload(),
                    })
                  }}
                >
                  <div className="section-head">
                    <h2>Create product</h2>
                    <span className="method">POST /api/products</span>
                  </div>
                  <ProductFields
                    value={productForm}
                    onChange={setProductForm}
                  />
                  <div className="actions">
                    <button className="btn primary" type="submit" disabled={loading}>
                      Create
                    </button>
                  </div>
                  <p className="hint">Requires JWT</p>
                </form>

                <form
                  className="section"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void run('Update', `/api/products/${productId}`, {
                      method: 'PUT',
                      body: productPayload(),
                    })
                  }}
                >
                  <div className="section-head">
                    <h2>Update product</h2>
                    <span className="method put">PUT /api/products/:id</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Product ID
                      <input
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                  <ProductFields
                    value={productForm}
                    onChange={setProductForm}
                  />
                  <div className="actions">
                    <button className="btn primary" type="submit" disabled={loading}>
                      Update
                    </button>
                  </div>
                  <p className="hint">Requires JWT · uses Product ID above</p>
                </form>

                <div className="section">
                  <div className="section-head">
                    <h2>Delete product</h2>
                    <span className="method delete">DELETE /api/products/:id</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Product ID
                      <input
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn danger"
                      disabled={loading}
                      onClick={() =>
                        void run('Delete', `/api/products/${productId}`, {
                          method: 'DELETE',
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                  <p className="hint">Requires JWT</p>
                </div>

                <div className="section">
                  <div className="section-head">
                    <h2>Reserve stock</h2>
                    <span className="method">POST /api/products/:id/reserve</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Product ID
                      <input
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                    <label>
                      Quantity
                      <input
                        value={reserveQty}
                        onChange={(e) => setReserveQty(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={loading}
                      onClick={() =>
                        void run('Reserve', `/api/products/${productId}/reserve`, {
                          method: 'POST',
                          body: { quantity: Number(reserveQty) },
                        })
                      }
                    >
                      Reserve
                    </button>
                  </div>
                  <p className="hint">Requires JWT · used internally by orders</p>
                </div>
              </>
            )}

            {tab === 'orders' && (
              <>
                <form
                  className="section"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void run('Create order', '/api/orders', {
                      method: 'POST',
                      body: {
                        items: orderItems.map((item) => ({
                          productId: Number(item.productId),
                          quantity: Number(item.quantity),
                        })),
                      },
                    })
                  }}
                >
                  <div className="section-head">
                    <h2>Place order</h2>
                    <span className="method">POST /api/orders</span>
                  </div>
                  <div className="item-rows">
                    {orderItems.map((item, index) => (
                      <div className="item-row" key={index}>
                        <label>
                          Product ID
                          <input
                            value={item.productId}
                            onChange={(e) => {
                              const next = [...orderItems]
                              next[index] = {
                                ...item,
                                productId: e.target.value,
                              }
                              setOrderItems(next)
                            }}
                            inputMode="numeric"
                            required
                          />
                        </label>
                        <label>
                          Quantity
                          <input
                            value={item.quantity}
                            onChange={(e) => {
                              const next = [...orderItems]
                              next[index] = {
                                ...item,
                                quantity: e.target.value,
                              }
                              setOrderItems(next)
                            }}
                            inputMode="numeric"
                            required
                          />
                        </label>
                        <button
                          type="button"
                          className="btn ghost"
                          disabled={orderItems.length === 1}
                          onClick={() =>
                            setOrderItems((rows) =>
                              rows.filter((_, i) => i !== index),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        setOrderItems((rows) => [
                          ...rows,
                          { productId: '1', quantity: '1' },
                        ])
                      }
                    >
                      Add line
                    </button>
                    <button className="btn primary" type="submit" disabled={loading}>
                      Place order
                    </button>
                  </div>
                  <p className="hint">
                    Requires JWT · gateway injects X-User-Name from token
                  </p>
                </form>

                <div className="section">
                  <div className="section-head">
                    <h2>My orders</h2>
                    <span className="method get">GET /api/orders</span>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={loading}
                      onClick={() => void run('My orders', '/api/orders')}
                    >
                      Load my orders
                    </button>
                  </div>
                  <p className="hint">Requires JWT</p>
                </div>

                <div className="section">
                  <div className="section-head">
                    <h2>Get order</h2>
                    <span className="method get">GET /api/orders/:id</span>
                  </div>
                  <div className="form-grid cols-2">
                    <label>
                      Order ID
                      <input
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn primary"
                      disabled={loading}
                      onClick={() =>
                        void run('Get order', `/api/orders/${orderId}`)
                      }
                    >
                      Fetch
                    </button>
                  </div>
                  <p className="hint">Requires JWT</p>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="panel response-panel">
          <div className="tabs">
            <span className="tab active" style={{ pointerEvents: 'none' }}>
              Response
            </span>
          </div>
          <div className="panel-body">
            {!result ? (
              <p className="empty-state">
                Run any request. Status, timing, and JSON body show up here.
              </p>
            ) : (
              <>
                <div className="response-meta">
                  <span className={`badge ${result.ok ? 'ok' : 'err'}`}>
                    {result.status || '—'} {result.statusText}
                  </span>
                  <span className="badge idle">{result.durationMs} ms</span>
                  {loading && <span className="badge idle">Sending…</span>}
                </div>
                {lastCall && <p className="hint">{lastCall}</p>}
                <pre className="response-body">
                  {typeof result.body === 'string'
                    ? result.body || '(empty body)'
                    : JSON.stringify(result.body, null, 2)}
                </pre>
              </>
            )}
          </div>
        </aside>
      </div>

      <p className="footer-note">
        Dev server proxies <code>/api</code> → gateway. Start Eureka, services,
        then gateway before testing. UI: <code>cd test-ui && npm run dev</code>
      </p>
    </div>
  )
}

function ProductFields({
  value,
  onChange,
}: {
  value: {
    name: string
    description: string
    price: string
    stock: string
    category: string
  }
  onChange: (next: typeof value) => void
}) {
  return (
    <div className="form-grid cols-2">
      <label>
        Name
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          required
        />
      </label>
      <label>
        Category
        <input
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          required
        />
      </label>
      <label>
        Price
        <input
          value={value.price}
          onChange={(e) => onChange({ ...value, price: e.target.value })}
          inputMode="decimal"
          required
        />
      </label>
      <label>
        Stock
        <input
          value={value.stock}
          onChange={(e) => onChange({ ...value, stock: e.target.value })}
          inputMode="numeric"
          required
        />
      </label>
      <label style={{ gridColumn: '1 / -1' }}>
        Description
        <textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </label>
    </div>
  )
}

export default App
