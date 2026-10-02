import type { BookFormValues, Genre } from '../types'
import { useState } from 'react'


type BookFormProps = {
  values: BookFormValues
  genres: Genre[]
  onChange: (next: BookFormValues) => void
  onSubmit: () => void
}

function BookForm({ values, genres, onChange, onSubmit }: BookFormProps) {
  const [message, setMessage] = useState<string | null>(null)
  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    setMessage(null)
    onChange({ ...values, [key]: value })
  }
  function handleSubmit() {
    if (
      values.title === '' ||
      values.description === '' ||
      values.author === '' ||
      values.publisher_email === '' ||
      values.shelf_location === ''
    ) {
      setMessage('Please fill in every field before creating a book.')
      return
    }

    setMessage('Book created.')
    onSubmit()
  }
  return (
    <section className="card">
      <h2>Create Book</h2>

      <div className="form-grid">
        <label htmlFor="book-title">Title</label>
        <input
          id="book-title"
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
        />

        <label htmlFor="book-genre">Genre</label>
        <select
          id="book-genre"
          value={values.genre}
          onChange={(event) => update('genre', event.target.value as Genre)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <label htmlFor="book-description">Description</label>
        <textarea
          id="book-description"
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
        />

        <label htmlFor="book-author">Author</label>
        <input
          id="book-author"
          value={values.author}
          onChange={(event) => update('author', event.target.value)}
        />

        <label htmlFor="book-publisher-email">Publisher Email</label>
        <input
          id="book-publisher-email"
          type="email"
          value={values.publisher_email}
          onChange={(event) => update('publisher_email', event.target.value)}
        />

        <label htmlFor="book-shelf-location">Shelf Location</label>
        <input
          id="book-shelf-location"
          value={values.shelf_location}
          onChange={(event) => update('shelf_location', event.target.value)}
        />
      </div>

      <button onClick={onSubmit}>Create Book</button>
      {message ? <p className = "form-message">{message}</p> : null}
    </section>
  )
}

export default BookForm
