import { type FormEvent, useState } from 'react'
import type { RunFn } from '../types'

type Props = {
  loading: boolean
  run: RunFn
}

export function AuthTab({ loading, run }: Props) {
  const [reg, setReg] = useState({
    username: 'alice',
    email: 'alice@example.com',
    password: 'secret12',
  })
  const [login, setLogin] = useState({ username: 'alice', password: 'secret12' })

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

  return (
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
              onChange={(e) => setReg((s) => ({ ...s, username: e.target.value }))}
              required
              minLength={3}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={reg.email}
              onChange={(e) => setReg((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={reg.password}
              onChange={(e) => setReg((s) => ({ ...s, password: e.target.value }))}
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
  )
}
