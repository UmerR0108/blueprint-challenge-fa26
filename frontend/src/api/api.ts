import type {
  Genre,
  Checkout,
  CheckoutFormValues,
  Book,
  BookFormValues,
} from "../types";

const API_BASE_URL = "http://localhost:8000";

export async function listBooks(params?: {
  q?: string;
  genre?: Genre | "All";
}): Promise<Book[]> {
  // Build the "?q=...&genre=..." part of the address.
  const query = new URLSearchParams();
  if (params && params.q) {
    query.set("q", params.q);
  }
  if (params && params.genre && params.genre !== "All") {
    query.set("genre", params.genre);
  }

  let url = `${API_BASE_URL}/books`;
  if (query.toString() !== "") {
    url = `${url}?${query.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load books");
  }
  return response.json();
}

export async function getBook(bookId: number): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
  if (!response.ok) {
    throw new Error("Could not load that book");
  }
  return response.json();
}

export async function createBook(
  payload: BookFormValues,
): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Could not create the book");
  }
  return response.json();
}

export async function listBookCheckouts(
  bookId: number,
): Promise<Checkout[]> {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/checkouts`);
  if (!response.ok) {
    throw new Error("could not load checkouts")
  }

  return response.json();
}

export async function createCheckout(
  payload: CheckoutFormValues,
): Promise<Checkout> {
  // The dropdown gives us book_id as text, but the API wants a number.
  const body = {
    patron_name: payload.patron_name,
    book_id: Number(payload.book_id),
    date: payload.date,
    notes: payload.notes,
  };

  const response = await fetch(`${API_BASE_URL}/checkouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Could not create the checkout");
  }
  return response.json();
}
