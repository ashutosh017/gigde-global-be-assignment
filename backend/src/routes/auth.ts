import express ,{Router} from "express";
import db from "../prismaClient/index";
import { JWT_SECRET  } from "../config";
import { signinSchema, signupSchema } from "../zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter:Router = express.Router();

authRouter.post("/signin", async (req, res) => {
  const parsedSchema = signinSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    console.log(parsedSchema.error.errors)
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }
  const { email, password } = parsedSchema.data;
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(400).json({
      message: "either username or password is wrong", 
    });
    return;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({
      message: "either username or password is wrong",
    });
  }
  const token = jwt.sign(user.id, JWT_SECRET);
  res.status(200).json({
    message: "signin success",
    token:token,
  });
});

authRouter.post("/signup", async (req, res) => {
  const parsedSchema = signupSchema.safeParse(req.body);
  console.log(req.body)
  if (!parsedSchema.success) {
    console.log(parsedSchema.error.errors)
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }
  try {
    const { name, email, password, country } = parsedSchema.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        country
      },
    });

    res.status(200).json({
      message: "signup successful",
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({
      message: "signup failed",
      reason: error,
    });
  }
});