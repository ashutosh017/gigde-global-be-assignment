import 'dotenv/config'
import { Request } from 'express';
export const JWT_SECRET = process.env.JWT_SECRET ?? "jwt_secret"


export interface AuthRequest extends Request {
    user?: { id: string; email: string }; // Extend Request to include user data
  }
  