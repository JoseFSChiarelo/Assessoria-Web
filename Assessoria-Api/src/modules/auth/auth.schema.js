import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Usuario obrigatorio"),
    password: z.string().min(1, "Senha deve ter ao menos 1 caracteres")
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({})
});

export { loginSchema };
