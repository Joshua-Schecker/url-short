import z from 'zod';


export const UrlInputSchema = z.object({
    url: z.string().url(),
})

export const UrlResourceSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    createdAt: z.date(),
    updatedAt: z.date(),
    shortUrl: z.string(),
});