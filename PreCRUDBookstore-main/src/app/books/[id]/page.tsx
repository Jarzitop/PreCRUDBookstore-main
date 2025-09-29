"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Review = { id:number; description:string; rating:number };
type Book = {
  id:number; name:string; image?:string; description?:string;
  publishingDate?:string; isbn?:string; reviews?:Review[];
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  // campos del nuevo review
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const r = await fetch(`/api/books/${id}`);
        if (!r.ok) throw new Error("Error al cargar libro");
        const data = await r.json();
        setBook(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function addReview() {
    try {
      if (!desc.trim()) return alert("Descripción requerida");
      const r = await fetch(`/api/books/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ajusta si tu backend pide otros campos
        body: JSON.stringify({ description: desc, rating }),
      });
      if (!r.ok) throw new Error("Error al crear review");
      const created: Review = await r.json();
      setBook(prev => prev ? { ...prev, reviews: [created, ...(prev.reviews ?? [])] } : prev);
      setDesc(""); setRating(5);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  if (loading) return <main className="p-6">Cargando…</main>;
  if (error)   return <main className="p-6 text-red-600">Error: {error}</main>;
  if (!book)   return <main className="p-6">Libro no encontrado.</main>;

  const src = book.image?.trim() ? book.image : "/placeholder.png";

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="flex gap-4">
        <img src={src} alt={book.name} className="h-32 w-32 rounded object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">{book.name}</h1>
          {book.publishingDate && <p className="text-sm text-gray-600">Publicado: {book.publishingDate}</p>}
          {book.isbn && <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>}
        </div>
      </header>

      {book.description && <p className="text-gray-800">{book.description}</p>}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Nuevo review</h2>
        <div className="flex flex-col gap-2">
          <textarea value={desc} onChange={e=>setDesc(e.target.value)}
            className="border p-2 rounded" placeholder="Tu opinión" />
          <input type="number" min={1} max={5} value={rating}
            onChange={e=>setRating(Number(e.target.value))} className="border p-2 rounded w-32" />
          <button onClick={addReview} className="px-4 py-2 rounded bg-black text-white">Agregar</button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {(book.reviews && book.reviews.length > 0) ? (
          <ul className="space-y-2">
            {book.reviews!.map(rv => (
              <li key={rv.id} className="border p-3 rounded">
                <div className="text-sm text-gray-600">Rating: {rv.rating}/5</div>
                <p>{rv.description}</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-600">Aún no hay reviews.</p>}
      </section>
    </main>
  );
}
