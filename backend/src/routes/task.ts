import express, { Request, Response, Router } from "express";
import db from "../prismaClient/index";
import { Task } from "@prisma/client";
import { AuthRequest } from "../config";


const taskRouter: Router = express.Router();



// 1. Create a task
taskRouter.post(
  "/:projectId",
  async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
       res
        .status(400)
        .json({ error: "Title, description, and status are required" });
        return
    }

    try {
      // Verify that the project exists and belongs to the user
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          userId: req.user!.id, // Use non-null assertion here
        },
      });

      if (!project) {
         res
          .status(404)
          .json({ error: "Project not found or you do not have permission" });
          return;
      }

      const newTask = await db.task.create({
        data: {
          title,
          description,
          status,
          projectId,
        },
      });

      res.status(201).json(newTask);
    } catch (error: any) {
      console.error("Error creating task:", error);
      res
        .status(500)
        .json({ error: "Failed to create task", details: error.message });
    }
  }
);

// 2. Delete a task
taskRouter.delete(
  "/:taskId",
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;

    try {
      // Verify that the task exists and belongs to the user's project
      const task = await db.task.findFirst({
        where: {
          id: taskId,
          project: {
            userId: req.user!.id,
          },
        },
        include: {
          project: true,
        },
      });

      if (!task) {
         res
          .status(404)
          .json({
            error: "Task not found or you do not have permission to delete it",
          });
          return;
      }

      await db.task.delete({
        where: {
          id: taskId,
        },
      });

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting task:", error);
      res
        .status(500)
        .json({ error: "Failed to delete task", details: error.message });
    }
  }
);

// 3. Update a task
taskRouter.put(
  "/:taskId",
  async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    const { title, description, status, dateCompleted } = req.body;

    try {
      // Verify that the task exists and belongs to the user's project
      const task = await db.task.findFirst({
        where: {
          id: taskId,
          project: {
            userId: req.user!.id,
          },
        },
        include: {
          project: true,
        },
      });

      if (!task) {
         res
          .status(404)
          .json({
            error: "Task not found or you do not have permission to update it",
          });
          return;
      }
      const updateData: Partial<Task> = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (status) updateData.status = status;
      if (dateCompleted) updateData.dateCompleted = dateCompleted;

      const updatedTask = await db.task.update({
        where: {
          id: taskId,
        },
        data: updateData,
      });

      res.status(200).json(updatedTask);
    } catch (error: any) {
      console.error("Error updating task:", error);
      res
        .status(500)
        .json({ error: "Failed to update task", details: error.message });
    }
  }
);

// 4. Get all tasks for a project
taskRouter.get(
  "/project/:projectId",
  async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    try {
      // Verify that the project exists and belongs to the user
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          userId: req.user!.id,
        },
      });

      if (!project) {
        res
          .status(404)
          .json({
            error:
              "Project not found or you do not have permission to access it",
          });
        return;
      }

      const tasks = await db.task.findMany({
        where: {
          projectId,
        },
        orderBy: {
          dateCreated: "desc", // Or any other ordering you prefer
        },
      });

      res.status(200).json(tasks);
    } catch (error: any) {
      console.error("Error getting tasks:", error);
      res
        .status(500)
        .json({ error: "Failed to retrieve tasks", details: error.message });
    }
  }
);

export default taskRouter;
