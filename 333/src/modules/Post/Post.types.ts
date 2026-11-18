import z, { minLength } from "zod";

export const PostSchema = z.object({
  id: z.number(),
  content: z.string().min({ minLength: 2 }),
  userId: z.number(),
});

export const PostCreateSchema = PostSchema.omit({ id: true, userId: true });



export type PostType = z.infer<typeof PostSchema>;
export type PostCreateType = z.infer<typeof PostCreateSchema>;


