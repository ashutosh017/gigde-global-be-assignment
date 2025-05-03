"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../../generated");
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new generated_1.PrismaClient();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
