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
            console.error("Erro desconhecido ao criar a categoria:", error);
            return res.status(500).json({ error: "Erro ao criar a categoria: " + error });
        }
    }
}
