import { useState } from 'react'
import './App.css'
import CheckoutForm from './components/CheckoutForm'
import BookDetail from './components/BookDetail'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import { GENRES, type Genre, type Checkout, type CheckoutFormValues, type Book, type BookFormValues } from './types'
import { createBook, createCheckout, getBook, listBookCheckouts, listBooks } from './api/api'

const initialBookForm: BookFormValues = {
  title: '',
  genre: 'Fiction',
  description: '',
  author: '',
  publisher_email: '',
  shelf_location: '',
}

const initialCheckoutForm: CheckoutFormValues = {
  patron_name: '',
  book_id: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookCheckouts, setBookCheckouts] = useState<Checkout[]>([])
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState<Genre | 'All'>('All')
  const [bookForm, setBookForm] = useState<BookFormValues>(initialBookForm)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormValues>(initialCheckoutForm)
  const [error, setError] = useState<string | null>(null)

  async function handleLoadBooks() {
    try {
      const results = await listBooks({ q: search, genre: genreFilter })
      setBooks(results)
      setError(null)
    } catch {
      setError('Could not load books.')
    }
  }

  async function handleSelectBook(bookId: number) {
    try {
      const book = await getBook(bookId)
      const checkouts = await listBookCheckouts(bookId)
      setSelectedBook(book)
      setBookCheckouts(checkouts)
      setCheckoutForm({ ...checkoutForm, book_id: String(bookId) })
      setError(null)
    } 
    catch {
      setError('couldnt load that book')
    }
  }
  
  function handleBookFormChange(next: BookFormValues) {
    setBookForm(next)
  }
  
  function handleCheckoutFormChange(next: CheckoutFormValues) {
    setCheckoutForm(next)
  }

  async function handleCreateBook() {
    try {
      await createBook(bookForm)
      setBookForm(initialBookForm)
      setError(null)
      await handleLoadBooks()
    } 
    catch {
      setError('couldnt create book')
    }
  }

  async function handleCreateCheckout() {
    try {
      await createCheckout(checkoutForm)
      setCheckoutForm({ ...initialCheckoutForm, book_id: checkoutForm.book_id })
      setError(null)

    if (selectedBook) {
      const checkouts = await listBookCheckouts(selectedBook.id)
      setBookCheckouts(checkouts)
      }
    } 
    catch {
      setError('couldnt create that checkout')
    }
  }

  return (
    <main className="layout">
      <header>
        <h1>LibraryConnect Resource Hub</h1>
        <p>Starter frontend scaffold with TODOs for API integration.</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h2>Integration TODO</h2>
        <p>
          Route handlers, form wiring, and API calls are intentionally left as TODOs for the team.
        </p>
        <button onClick={() => void handleLoadBooks()}>Load Books (TODO API)</button>
      </section>

      <BookList
        books={books}
        search={search}
        genreFilter={genreFilter}
        onSearchChange={setSearch}
        onGenreChange={setGenreFilter}
        onSelectBook={(bookId) => void handleSelectBook(bookId)}
        genres={GENRES}
      />

      <BookForm
        values={bookForm}
        genres={GENRES}
        onChange={handleBookFormChange}
        onSubmit={() => void handleCreateBook()}
      />

      <BookDetail book={selectedBook} checkouts={bookCheckouts} />

      <CheckoutForm
        values={checkoutForm}
        books={books}
        onChange={handleCheckoutFormChange}
        onSubmit={() => void handleCreateCheckout()}
      />
    </main>
  )
}

export default App
