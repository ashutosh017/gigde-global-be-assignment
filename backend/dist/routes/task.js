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
const taskRouter = express_1.default.Router();
// 1. Create a task
taskRouter.post("/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
        res
            .status(400)
            .json({ error: "Title, description, and status are required" });
        return;
    }
    try {
        // Verify that the project exists and belongs to the user
        const project = yield index_1.default.project.findFirst({
            where: {
                id: projectId,
                userId: req.user.id, // Use non-null assertion here
            },
        });
        if (!project) {
            res
                .status(404)
                .json({ error: "Project not found or you do not have permission" });
            return;
        }
        const newTask = yield index_1.default.task.create({
            data: {
                title,
                description,
                status,
                projectId,
            },
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res
            .status(500)
            .json({ error: "Failed to create task", details: error.message });
    }
}));
// 2. Delete a task
taskRouter.delete("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        // Verify that the task exists and belongs to the user's project
        const task = yield index_1.default.task.findFirst({
            where: {
                id: taskId,
                project: {
                    userId: req.user.id,
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
        yield index_1.default.task.delete({
            where: {
                id: taskId,
            },
        });
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res
            .status(500)
            .json({ error: "Failed to delete task", details: error.message });
    }
}));
// 3. Update a task
taskRouter.put("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { title, description, status, dateCompleted } = req.body;
    try {
        // Verify that the task exists and belongs to the user's project
        const task = yield index_1.default.task.findFirst({
            where: {
                id: taskId,
                project: {
                    userId: req.user.id,
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
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (status)
            updateData.status = status;
        if (dateCompleted)
            updateData.dateCompleted = dateCompleted;
        const updatedTask = yield index_1.default.task.update({
            where: {
                id: taskId,
            },
            data: updateData,
        });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res
            .status(500)
            .json({ error: "Failed to update task", details: error.message });
    }
}));
// 4. Get all tasks for a project
taskRouter.get("/project/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res
                .status(404)
                .json({
                error: "Project not found or you do not have permission to access it",
            });
            return;
        }
        const tasks = yield index_1.default.task.findMany({
            where: {
                projectId,
            },
            orderBy: {
                dateCreated: "desc", // Or any other ordering you prefer
            },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Error getting tasks:", error);
        res
            .status(500)
            .json({ error: "Failed to retrieve tasks", details: error.message });
    }
}));
exports.default = taskRouter;
