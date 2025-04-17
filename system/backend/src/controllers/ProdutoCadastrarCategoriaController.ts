import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ProdutoCadastrarCategoriaService } from "../services/ProdutoCadastrarCategoriaService";

export class ProdutoCadastrarCategoriaController {
    async handle(req: Request, res: Response) {
        const { 
            nomeCategoria 
        } = req.body;

        const produtoCadastrarCategoriaService = new ProdutoCadastrarCategoriaService();

        try {
            const categoria = await produtoCadastrarCategoriaService.execute({ nomeCategoria });
            return res.status(categoria.status).json(categoria);
        } catch (error) {
            console.error("Erro desconhecido ao criar a categoria:", error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar a categoria: " + error });
        }
    }
}
