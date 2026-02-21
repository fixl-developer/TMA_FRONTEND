/**
 * API Client - Backend Integration Layer
 *
 * Fetch wrapper for REST API. Use when backend is ready.
 * Set NEXT_PUBLIC_USE_MOCK_API=false and NEXT_PUBLIC_API_URL to switch.
 *
 * @example
 * const data = await apiClient.get('/tenants')
 * await apiClient.post('/contracts', { ... })
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false"

export type ApiError = {
  status: number
  message: string
  code?: string
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) headers["Authorization"] = `Bearer ${token}`
    const tenantId = localStorage.getItem("current_tenant_id")
    if (tenantId) headers["X-Tenant-Id"] = tenantId
  }
  return headers
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: res.statusText,
    }
    try {
      const body = await res.json()
      err.message = body.message ?? body.error ?? res.statusText
      err.code = body.code
    } catch {
      // ignore
    }
    throw err
  }
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "GET",
      headers: { ...headers, ...options?.headers },
    })
    return handleResponse<T>(res)
  },

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "POST",
      headers: { ...headers, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },

  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "PUT",
      headers: { ...headers, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },

  async patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "PATCH",
      headers: { ...headers, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "DELETE",
      headers: { ...headers, ...options?.headers },
    })
    return handleResponse<T>(res)
  },
}

/** Whether the app is using mock API (seed data) vs real backend */
export function useMockApi(): boolean {
  return USE_MOCK
}
