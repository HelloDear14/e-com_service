import { useState } from 'react'
import type { OrderItemForm, RunFn } from '../types'

type Props = {
  loading: boolean
  run: RunFn
}

export function OrdersTab({ loading, run }: Props) {
  const [orderId, setOrderId] = useState('1')
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { productId: '1', quantity: '1' },
  ])

  return (
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
                    next[index] = { ...item, productId: e.target.value }
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
                    next[index] = { ...item, quantity: e.target.value }
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
                  setOrderItems((rows) => rows.filter((_, i) => i !== index))
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
            onClick={() => void run('Get order', `/api/orders/${orderId}`)}
          >
            Fetch
          </button>
        </div>
        <p className="hint">Requires JWT</p>
      </div>
    </>
  )
}
