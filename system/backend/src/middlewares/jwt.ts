import jwt from "jsonwebtoken";
import { hashPayload } from "../configs/bcrypt.js";
import { JwtPayload } from "../configs/token.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function generateToken(payload: JwtPayload): Promise<string> {
    const hash = await hashPayload(payload);
    return jwt.sign({ hash }, JWT_SECRET);
}

export function validateToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new Error("jwt expired");
        } else if (error.name === "JsonWebTokenError") {
            throw new Error("invalid token");
        } else {
            throw new Error("Erro ao validar o token: " + error.message);
        }
    }
}