import jwt from "jsonwebtoken";
import { hashPayload } from "../configs/bcrypt.js";
import { JwtPayload } from "../configs/token.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function generateToken(payload: JwtPayload): Promise <string> {
    const payloadHash = await hashPayload(payload);
    return jwt.sign({ payloadHash }, JWT_SECRET);
}

export function validateToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch(error) {
        return null;
    }
}