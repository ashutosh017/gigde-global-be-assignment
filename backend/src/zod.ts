import z from 'zod'

export const signinSchema = z.object({
    email: z.string().min(5).max(500).email(),
    password: z.string().min(3).max(100),
  });
  
  export const signupSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(100),
    country:z.string().nonempty().max(100)
  });

  declare global {
    namespace Express {
      interface Request {
        userId: string;
      }
    }
  }