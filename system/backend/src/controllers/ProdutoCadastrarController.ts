import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ProdutoCadastrarService } from "../services/ProdutoCadastrarService";
import { getUserIdFromToken } from "../configs/session";

export class ProdutoCadastrarController {
    async handle(req: Request, res: Response) {
        const {
            nomeCategoria,
            nomeProduto, 
            valor, 
            tipoProduto
        } = req.body;

        const produtoCadastrarService = new ProdutoCadastrarService();

        try {
            const idEmpresa = await getUserIdFromToken(req);
            const produto = await produtoCadastrarService.execute({ nomeCategoria, idEmpresa, nomeProduto, valor, tipoProduto });

            return res.status(produto.status).json(produto);
        } catch (error) {
            console.error(`Erro ao registar produto ${error}`);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ message: `Erro ao registrar o produto: ${error}` });
        }
    }
}
