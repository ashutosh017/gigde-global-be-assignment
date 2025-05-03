"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../prismaClient/index"));
const projectRouter = express_1.default.Router();
// 1. Create a project
projectRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: "Project name is required" });
        return;
    }
    try {
        // Check the user's project count
        const user = yield index_1.default.user.findUnique({
            where: {
                id: req.user.id,
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
            res.status(400).json({ error: "User cannot have more than 4 projects" });
            return;
        }
        const newProject = yield index_1.default.project.create({
            data: {
                name,
                userId: req.user.id,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project", details: error.message });
    }
}));
// 2. Delete a project
projectRouter.delete("/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        // Verify that the project exists and belongs to the user
        const project = yield index_1.default.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.id,
            },
        });
        if (!project) {
            res.status(404).json({ error: "Project not found or you do not have permission to delete it" });
            return;
        }
        yield index_1.default.project.delete({
            where: {
                id: projectId,
            },
        });
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project", details: error.message });
    }
}));
// 3. Get all projects for a user
projectRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield index_1.default.project.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                id: 'asc' // You can change the ordering as needed
            },
            include: {
                user: true
            }
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error("Error getting projects:", error);
        res.status(500).json({ error: "Failed to retrieve projects", details: error.message });
    }
}));
exports.default = projectRouter;
