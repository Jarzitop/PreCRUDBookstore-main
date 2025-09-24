const http = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const r = await fetch(input, init);
  const t = await r.text();
  if (!r.ok) throw new Error(t || "HTTP error");
  return t ? (JSON.parse(t) as T) : (undefined as unknown as T);
};


export type Author = {
  id: number;
  name: string;
  birthDate: string;
  image: string;
  description: string;
};

export const listAuthors  = () => http<Author[]>("/api/authors");

export const createAuthor = (d: Omit<Author, "id">) =>
  http<Author>("/api/authors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });

export const updateAuthor = (id: number, d: Partial<Author>) =>
  http<Author>(`/api/authors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });

export const deleteAuthor = (id: number) =>
  http<void>(`/api/authors/${id}`, { method: "DELETE" });
