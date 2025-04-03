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
            return res.status(500).json({ message: "Erro ao criar categoria", error });
        }
    }
}
