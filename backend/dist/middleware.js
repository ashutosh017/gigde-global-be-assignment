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
exports.authMiddleware = void 0;
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // Bearer <token>
    if (token == null) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("auth header not found");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("token not found");
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        const userId = decode;
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        req.userId = userId;
        next();
    }
    catch (e) {
        res.status(403).json({
            message: "Unauthorized",
        });
        return;
    }
});
exports.authMiddleware = authMiddleware;
