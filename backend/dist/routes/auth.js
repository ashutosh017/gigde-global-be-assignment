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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../prismaClient/index"));
const config_1 = require("../config");
const zod_1 = require("../zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSchema = zod_1.signinSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        console.log(parsedSchema.error.errors);
        res.status(400).json({
            message: "Invalid credentials",
        });
        return;
    }
    const { email, password } = parsedSchema.data;
    const user = yield index_1.default.user.findUnique({
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
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.status(400).json({
            message: "either username or password is wrong",
        });
    }
    const token = jsonwebtoken_1.default.sign(user.id, config_1.JWT_SECRET);
    res.status(200).json({
        message: "signin success",
        token: token,
    });
}));
exports.authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSchema = zod_1.signupSchema.safeParse(req.body);
    console.log(req.body);
    if (!parsedSchema.success) {
        console.log(parsedSchema.error.errors);
        res.status(400).json({
            message: "Invalid credentials",
        });
        return;
    }
    try {
        const { name, email, password, country } = parsedSchema.data;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield index_1.default.user.create({
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
    }
    catch (error) {
        res.status(400).json({
            message: "signup failed",
            reason: error,
        });
    }
}));
