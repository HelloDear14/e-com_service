export type Tab = 'auth' | 'products' | 'orders'

export type Session = {
  token: string
  username: string
  role: string
}

export type ProductForm = {
  name: string
  description: string
  price: string
  stock: string
  category: string
}

export type OrderItemForm = {
  productId: string
  quantity: string
}

export type RunFn = (
  label: string,
  path: string,
  options?: {
    method?: string
    body?: unknown
    token?: string | null
    headers?: Record<string, string>
  },
) => Promise<void>
