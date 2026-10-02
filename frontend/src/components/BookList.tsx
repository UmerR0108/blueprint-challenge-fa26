import type { Book, Genre } from '../types'

type BookListProps = {
  books: Book[]
  search: string
  genreFilter: Genre | 'All'
  onSearchChange: (next: string) => void
  onGenreChange: (next: Genre | 'All') => void
  onSelectBook: (id: number) => void
  genres: Genre[]
}

function BookList({
  books,
  search,
  genreFilter,
  onSearchChange,
  onGenreChange,
  onSelectBook,
  genres,
}: BookListProps) {
  return (
    <section className="card">
      <h2>Books</h2>

      <div className="filters">
        <label htmlFor="book-search">Search</label>
        <input
          id="book-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title"
        />

        <label htmlFor="book-genre-filter">Genre</label>
        <select
          id="book-genre-filter"
          value={genreFilter}
          onChange={(event) => onGenreChange(event.target.value as Genre | 'All')}
        >
          <option value="All">All</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {books.length === 0 ? (<p className = "empty">No Books match the search and filter</p>) : null}
      <ul className="list">
        {books.map((book) => (
          <li key={book.id} className="list-item">
            <div>
              <strong>{book.title}</strong>
              <span className="tag">{book.genre}</span>
            </div>
            <button onClick={() => onSelectBook(book.id)}>View Details</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BookList
