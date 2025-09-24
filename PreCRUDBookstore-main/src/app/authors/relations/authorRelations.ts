const http = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const r = await fetch(input, init);
  const t = await r.text();
  if (!r.ok) throw new Error(t || "HTTP error");
  return t ? (JSON.parse(t) as T) : (undefined as unknown as T);
};


export const createBook = (d: { name: string; isbn: string }) =>
  http<{ id: number }>("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });

export const createPrize = (d: { name: string; premiationDate: string }) =>
  http<{ id: number }>("/api/prizes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });

export const linkBookToAuthor = (authorId: number, bookId: number) =>
  http<void>(`/api/authors/${authorId}/books/${bookId}`, { method: "POST" });

export const linkPrizeToAuthor = (prizeId: number, authorId: number) =>
  http<void>(`/api/prizes/${prizeId}/author/${authorId}`, { method: "POST" });

export async function createAuthorWithRelations(input: {
  author: { name: string; birthDate: string; image: string; description: string };
  book: { name: string; isbn: string };
  prize: { name: string; premiationDate: string };
}) {
  // crea autor
  const a = await http<{ id: number }>("/api/authors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input.author),
  });

  // crea libro y premio
  const b = await createBook(input.book);
  const p = await createPrize(input.prize);

  // asocia
  await linkBookToAuthor(a.id, b.id);
  await linkPrizeToAuthor(p.id, a.id);

  return { authorId: a.id, bookId: b.id, prizeId: p.id };
}
