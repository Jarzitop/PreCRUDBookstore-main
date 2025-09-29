"use client";
import { useState, useCallback } from "react";

export type Book = {
  id: number;
  name: string;
  image?: string;
  isbn?: string;
  publishingDate?: string;
  description?: string;
};

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const r = await fetch("/api/books"); // minúsculas
      if (!r.ok) throw new Error("Error al cargar");
      const data = await r.json();
      const arr = Array.isArray(data) ? data : (data.items ?? data.content ?? []);
      setBooks(arr ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Omit<Book, "id">) => {
    const r = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error("Error al crear");
    return r.json() as Promise<Book>;
  }, []);

  const update = useCallback(async (id: number, data: Partial<Book>) => {
    const r = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error("Error al actualizar");
    return r.json() as Promise<Book>;
  }, []);

  const removeById = useCallback(async (id: number) => {
    const r = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Error al eliminar");
  }, []);

  return { books, setBooks, loading, error, load, create, update, removeById };
}
