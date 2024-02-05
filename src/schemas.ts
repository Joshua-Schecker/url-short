import z from 'zod';

export const urlInputSchema = z.object({
  url: z.string().url(),
});

export const urlResourceSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  userId: z.string(),
});
export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UrlResourceSchema = z.infer<typeof urlResourceSchema>;
