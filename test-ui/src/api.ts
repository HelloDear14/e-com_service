/** Gateway origin for production builds. Empty = relative `/api` (Vite proxy in dev). */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
)

export type ApiResult = {
  ok: boolean
  status: number
  statusText: string
  durationMs: number
  body: unknown
  rawText: string
}

export async function apiRequest(
  path: string,
  options: {
    method?: string
    body?: unknown
    token?: string | null
    headers?: Record<string, string>
  } = {},
): Promise<ApiResult> {
  const { method = 'GET', body, token, headers = {} } = options
  const started = performance.now()
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  const requestHeaders: Record<string, string> = { ...headers }
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: 'Network Error',
      durationMs: Math.round(performance.now() - started),
      body: {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to reach the API. Is the gateway running?',
      },
      rawText: '',
    }
  }

  const durationMs = Math.round(performance.now() - started)
  const rawText = await response.text()
  let parsed: unknown = rawText
  if (rawText) {
    try {
      parsed = JSON.parse(rawText)
    } catch {
      parsed = rawText
    }
  } else {
    parsed = response.status === 204 ? null : ''
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    durationMs,
    body: parsed,
    rawText,
  }
}
