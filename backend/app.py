from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

try:
    from .database import Base, engine, get_db
    from .db_models import Book, Checkout
    from .models import (
        CheckoutCreate,
        CheckoutResponse,
        BookGenre,
        BookCreate,
        BookResponse,
    )
except ImportError:
    from database import Base, engine, get_db
    from db_models import Book, Checkout
    from models import (
        CheckoutCreate,
        CheckoutResponse,
        BookGenre,
        BookCreate,
        BookResponse,
    )

app = FastAPI(title="LibraryConnect API Starter")
Base.metadata.create_all(bind=engine)



def book_to_response(book: Book) -> BookResponse:
    return BookResponse(
        id=book.id,
        title=book.title,
        genre=book.genre,
        description=book.description,
        author=book.author,
        publisher_email=book.publisher_email,
        shelf_location=book.shelf_location,
    )


def checkout_to_response(checkout: Checkout) -> CheckoutResponse:
    return CheckoutResponse(
        id=checkout.id,
        patron_name=checkout.patron_name,
        book_id=checkout.book_id,
        date=checkout.date,
        notes=checkout.notes,
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/books", response_model=BookResponse)
def create_book(payload: BookCreate, db: Session = Depends(get_db)) -> BookResponse:
    # Build a new row out of what the browser sent us.
    book = Book(
        title=payload.title,
        genre=payload.genre.value,
        description=payload.description,
        author=payload.author,
        publisher_email=payload.publisher_email,
        shelf_location=payload.shelf_location,
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return book_to_response(book)


@app.get("/books", response_model=list[BookResponse])
def list_books(
    q: str | None = None, genre: BookGenre | None = None, db: Session = Depends(get_db),) -> list[BookResponse]:
    query = db.query(Book)
    # Only narrow the search if the browser actually sent a filter.
    if q is not None and q != "":
        query = query.filter(Book.title.ilike("%" + q + "%"))
    if genre is not None:
        query = query.filter(Book.genre == genre.value)
    books = query.order_by(Book.id).all()
    results = []
    for book in books:
        results.append(book_to_response(book))
    return results

@app.get("/books/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)) -> BookResponse:
    book = db.query(Book).filter(Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail = "Couldn't find that book")

    return book_to_response(book)
    


@app.post("/checkouts", response_model=CheckoutResponse)
def create_checkout(payload: CheckoutCreate, db: Session = Depends(get_db)) -> CheckoutResponse:
    book = db.query(Book).filter(Book.id == payload.book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Couldnt find that book")

    checkout = Checkout(
        patron_name=payload.patron_name,
        book_id=payload.book_id,
        date = payload.date,
        notes=payload.notes,
    )

    db.add(checkout)
    db.commit()
    db.refresh(checkout)

    return checkout_to_response(checkout)


@app.get("/books/{book_id}/checkouts", response_model=list[CheckoutResponse])
def list_book_checkouts(book_id: int, db: Session = Depends(get_db)) -> list[CheckoutResponse]:
    book = db.query(Book).filter(Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="couldn't find that book")
    checkouts = (db.query(Checkout).filter(Checkout.book_id == book_id).order_by(Checkout.id).all())

    results = []
    for checkout in checkouts:
        results.append(checkout_to_response(checkout))
    return results
    
    