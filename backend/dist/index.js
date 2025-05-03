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
const cors_1 = __importDefault(require("cors"));
const task_1 = __importDefault(require("./routes/task"));
const project_1 = __importDefault(require("./routes/project"));
const auth_1 = require("./routes/auth");
const middleware_1 = require("./middleware");
const prismaClient_1 = __importDefault(require("./prismaClient"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Parse JSON request bodies
// Routes
app.use('/tasks', middleware_1.authMiddleware, task_1.default);
app.use('/projects', middleware_1.authMiddleware, project_1.default);
app.use('/auth', auth_1.authRouter); // Mount the user router
// Default route (optional)
app.get('/', (req, res) => {
    res.send('API is running!');
});
app.get("/user", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.user.findFirst({
            where: {
                id: req.userId
            }
        });
        res.status(200).json({
            user
        });
    }
    catch (error) {
        res.status(400).json({
            msg: "cannot find user"
        });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
