import type { ApiResult } from '../api'

type Props = {
  result: ApiResult | null
  lastCall: string
  loading: boolean
}

export function ResponsePanel({ result, lastCall, loading }: Props) {
  return (
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
  )
}
