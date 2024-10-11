import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/token.js";
import { JwtPayload } from "../config/token.js";

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h"});
}

export function validateToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch(error) {
        return null;
    }
}