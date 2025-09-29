"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const is = (p: string) => pathname === p || pathname?.startsWith(p + "/");

  return (
    <header className="border-b bg-black/5">
      <nav className="mx-auto max-w-5xl px-4 h-12 flex items-center gap-4">
        <Link href="/" className="font-semibold mr-4">Bookstore</Link>
        <Link
          href="/authors"
          className={`px-2 py-1 rounded ${is("/authors") ? "bg-black text-white" : "hover:underline"}`}
        >
          Autores
        </Link>
        <Link
          href="/books"
          className={`px-2 py-1 rounded ${is("/books") ? "bg-black text-white" : "hover:underline"}`}
        >
          Libros
        </Link>
      </nav>
    </header>
  );
}
