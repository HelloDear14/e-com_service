import { useState } from 'react'
import type { ProductForm, RunFn } from '../types'
import { ProductFields } from './ProductFields'

type Props = {
  loading: boolean
  run: RunFn
}

export function ProductsTab({ loading, run }: Props) {
  const [categoryFilter, setCategoryFilter] = useState('')
  const [productId, setProductId] = useState('1')
  const [productForm, setProductForm] = useState<ProductForm>({
    name: 'Keyboard',
    description: 'Mechanical',
    price: '79.99',
    stock: '25',
    category: 'Electronics',
  })
  const [reserveQty, setReserveQty] = useState('1')

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
              void run('Get', `/api/products/${productId}`, { token: null })
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
        <ProductFields value={productForm} onChange={setProductForm} />
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
        <ProductFields value={productForm} onChange={setProductForm} />
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
  )
}
