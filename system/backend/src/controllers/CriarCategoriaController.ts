import { Request, Response } from "express";
import { CriarCategoriaService } from "../services/CriarCategoriaService.js";

export class CriarCategoriaController {
    async handle(req: Request, res: Response) {
        const { 
            nomeCategoria 
        } = req.body;

        const criarCategoriaService = new CriarCategoriaService();

        try {
            const categoria = await criarCategoriaService.execute({ nomeCategoria });
            return res.status(categoria.status).json(categoria);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("validation")) {
                    return res.status(400).json({ message: "Erro de validação: " + error.message });
                }
                if (error.message.includes("duplicate")) {
                    return res.status(409).json({ message: "Erro de duplicidade: " + error.message });
                }
                return res.status(500).json({ message: "Erro ao criar a categoria", error: error.message });
            } else {
                console.error("Erro desconhecido ao criar a categoria:", error);
                return res.status(500).json({ message: "Erro desconhecido ao criar a categoria" });
            }
        }
    }
}
