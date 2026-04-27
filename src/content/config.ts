import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    author: z.string().default('Brandon Visca'),
    heroImage: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
