// 
import { z } from "zod";

export const AuthorWithRelationsSchema = z.object({  //en vez de cambiar la estrutura de Author, creamos una nueva estructura que contenga las relaciones
  name: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  image: z.string().url(),
  description: z.string().min(1),
  book: z.object({
    name: z.string().min(1),
    isbn: z.string().min(5),
  }),
  prize: z.object({
    name: z.string().min(1),
    premiationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});
export type AuthorWithRelationsForm = z.infer<typeof AuthorWithRelationsSchema>;

