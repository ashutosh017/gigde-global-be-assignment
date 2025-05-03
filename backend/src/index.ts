import express from 'express';

import cors from 'cors';
import taskRouter from './routes/task';
import projectRouter from './routes/project';
import { authRouter } from './routes/auth';
import { authMiddleware } from './middleware';
import prisma from './prismaClient';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/tasks', authMiddleware,taskRouter);
app.use('/projects', authMiddleware,projectRouter);
app.use('/auth', authRouter); // Mount the user router

// Default route (optional)
app.get('/', (req, res) => {
  res.send('API is running!');
});
app.get("/user",authMiddleware,async(req,res)=>{
  try {
    const user = await prisma.user.findFirst({
      where:{
        id:req.userId
      }
    })
    res.status(200).json({
      user
    })
  } catch (error) {
    res.status(400).json({
      msg:"cannot find user"
    })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});