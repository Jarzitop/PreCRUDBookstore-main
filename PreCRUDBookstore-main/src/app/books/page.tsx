"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useBooks } from "@/hooks/useBooks";

export default function BooksPage() {
  const { books, setBooks, loading, error, load, removeById } = useBooks();

  useEffect(() => { load(); }, [load]);

  async function onDelete(id: number) {
    const prev = books;
    setBooks(prev.filter(b => b.id !== id)); // optimista
    try {
      await removeById(id);
    } catch (e: unknown) {
      setBooks(prev); // rollback
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  if (loading) return <main className="p-6">Cargando…</main>;
  if (error)   return <main className="p-6 text-red-600">Error: {error}</main>;

  const list = Array.isArray(books) ? books : [];

  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Libros</h1>
        <Link href="/books/crear" className="px-3 py-2 rounded bg-black text-white">
          Crear libro
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-gray-600">No hay libros aún.</p>
      ) : (
        <ul className="space-y-2">
          {list.map(b => {
            const src = b.image?.trim() ? b.image : "/placeholder.png";
            return (
              <li key={b.id} className="p-3 rounded border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={src} alt={b.name} className="h-12 w-12 rounded object-cover" width={48} height={48} />
                  <div>
                    <div className="font-medium">{b.name}</div>
                    {b.isbn && <div className="text-sm text-gray-600">ISBN: {b.isbn}</div>}
                    {b.publishingDate && <div className="text-sm text-gray-600">{b.publishingDate}</div>}
                    {b.description && <p className="text-sm text-gray-500 line-clamp-2">{b.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/books/${b.id}`} className="text-blue-600 underline">Detalle</Link>

                  <button onClick={() => onDelete(b.id)} className="text-red-600">Eliminar</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
