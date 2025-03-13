import { Request, Response, NextFunction } from "express";
import { validateToken } from "./jwt.js";

export function authMiddleware ( req: Request, res: Response, next: NextFunction ): void {
    const authHeader = req.headers["authorization"]!;
    if(!authHeader) {
        res.status(401).json({ message: "Token not found" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        res.status(401).json({ message: "Token not found" });
        return;
    }
    try {
        const decodedToken = validateToken(token)!;
        if(!decodedToken) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.body.cpf_cnpj_empresa = decodedToken.hash.hash_cpf_cnpj;
        req.body.id_empresa ??= decodedToken.hash.hash_id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
}
