import z from "zod";

export const snippetFormSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  code: z.string().min(4, {
    message: "Code must be at least 4 characters.",
  }),
});
