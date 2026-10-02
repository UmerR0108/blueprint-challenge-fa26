import type { CheckoutFormValues, Book } from '../types'
import { useState } from 'react'

type CheckoutFormProps = {
  values: CheckoutFormValues
  books: Book[]
  onChange: (next: CheckoutFormValues) => void
  onSubmit: () => void
}

function CheckoutForm({ values, books, onChange, onSubmit }: CheckoutFormProps) {
  const [message, setMessage] = useState<string | null>(null)
  function update<K extends keyof CheckoutFormValues>(key: K, value: CheckoutFormValues[K]) {
    setMessage(null)
    onChange({ ...values, [key]: value })
  }
  function handleSubmit() {
    if ( values.patron_name === '' || values.book_id === '' || values.date === '' || values.notes === '') 
    {
      setMessage('Please fill in every field before recording a checkout.')
      return
    }
    setMessage('Checkout recorded.')
    onSubmit()
  }

  return (
    <section className="card">
      <h2>Create Checkout</h2>

      <div className="form-grid">
        <label htmlFor="checkout-patron-name">Patron Name</label>
        <input
          id="checkout-patron-name"
          value={values.patron_name}
          onChange={(event) => update('patron_name', event.target.value)}
        />

        <label htmlFor="checkout-book">Book</label>
        <select
          id="checkout-book"
          value={values.book_id}
          onChange={(event) => update('book_id', event.target.value)}
        >
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book.id} value={String(book.id)}>
              {`${book.id} - ${book.title}`}
            </option>
          ))}
        </select>

        <label htmlFor="checkout-date">Date</label>
        <input
          id="checkout-date"
          type="date"
          value={values.date}
          onChange={(event) => update('date', event.target.value)}
        />

        <label htmlFor="checkout-notes">Notes</label>
        <textarea
          id="checkout-notes"
          value={values.notes}
          onChange={(event) => update('notes', event.target.value)}
        />
      </div>

      <button onClick={onSubmit}>Create Checkout</button>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  )
}

export default CheckoutForm
