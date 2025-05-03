import express ,{Request, Response, Router} from "express";
import db from "../prismaClient/index";
import { AuthRequest, JWT_SECRET  } from "../config";
import jwt from "jsonwebtoken";
import { Project } from "@prisma/client";

const projectRouter: Router = express.Router();


// 1. Create a project
projectRouter.post("/", async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    if (!name) {
         res.status(400).json({ error: "Project name is required" });
         return;
    }

    try {
        // Check the user's project count
        const user = await db.user.findUnique({
            where: {
                id: req.user!.id,
            },
            include: {
                projects: true,
            },
        });

        if (!user) {
             res.status(404).json({ error: "User not found" }); // Should not happen, but good to check
             return;
        }

        if (user.projects.length >= 4) {
             res.status(400).json({ error: "User cannot have more than 4 projects" });return;
        }

        const newProject: Project = await db.project.create({
            data: {
                name,
                
                userId: req.user!.id,
            },
        });

        res.status(201).json(newProject);
    } catch (error: any) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project", details: error.message });
    }
});

// 2. Delete a project
projectRouter.delete("/:projectId", async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    try {
        // Verify that the project exists and belongs to the user
        const project: Project | null = await db.project.findFirst({
            where: {
                id: projectId,
                userId: req.user!.id,
            },
        });

        if (!project) {
             res.status(404).json({ error: "Project not found or you do not have permission to delete it" });
             return;
        }

        await db.project.delete({
            where: {
                id: projectId,
            },
        });

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project", details: error.message });
    }
});

// 3. Get all projects for a user
projectRouter.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const projects = await db.project.findMany({
            where: {
                userId: req.user!.id,
            },
            orderBy: {
                id: 'asc' // You can change the ordering as needed
            },
            include:{
                user:true
            }
        });
        res.status(200).json(projects);
    } catch (error: any) {
        console.error("Error getting projects:", error);
        res.status(500).json({ error: "Failed to retrieve projects", details: error.message });
    }
});

export default projectRouter;