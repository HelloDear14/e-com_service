import type { ProductForm } from '../types'

type Props = {
  value: ProductForm
  onChange: (next: ProductForm) => void
}

export function ProductFields({ value, onChange }: Props) {
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
