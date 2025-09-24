"use client";
import { useState, useCallback } from "react";

export type Book = { id:number; name:string; birthDate:string; image:string; description:string };

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/Books"); if (!r.ok) throw new Error("Error al cargar");
      setBooks(await r.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }, []);

  const create = useCallback(async (data: Omit<Book,"id">) => {
    const r = await fetch("/api/Books", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("Error al crear");
    return r.json() as Promise<Book>;
  }, []);

  const update = useCallback(async (id:number, data: Partial<Book>) => {
    const r = await fetch(`/api/Books/${id}`, { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("Error al actualizar");
    return r.json() as Promise<Book>;
  }, []);

  const removeById = useCallback(async (id:number) => {
    const r = await fetch(`/api/Books/${id}`, { method:"DELETE" });
    if (!r.ok) throw new Error("Error al eliminar");
  }, []);

  return { books, setBooks, loading, error, load, create, update, removeById };
}
