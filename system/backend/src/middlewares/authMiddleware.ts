import { Request, Response, NextFunction } from "express";
import { validateToken } from "./jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: "Token não encontrado" });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token não encontrado" });
        return;
    }

    try {
        const decodedToken = validateToken(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }

        const isAuthenticated = req.session?.loginHistory?.some(
            (item: any) => item.token === token
        );
        
        if (!isAuthenticated) {
            return res.status(401).json('Usuário não autenticado. Faça login.');
        }

        req.body.cpf_cnpj_empresa = decodedToken.hash.hash_cpf_cnpj;
        req.body.id_empresa = decodedToken.hash.hash_id;
        req.body.token = token;
        
        next();
    } catch (error: any) {
        if (error.message.includes("jwt expired")) {
            res.status(401).json({ message: "Token expirado" });
        } else if (error.message.includes("invalid token")) {
            res.status(401).json({ message: "Token inválido" });
        } else {
            res.status(500).json({ message: "Erro ao validar o token", error: error.message });
        }
    }
}