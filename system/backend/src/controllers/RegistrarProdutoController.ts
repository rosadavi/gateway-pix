import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { RegistrarProdutoService } from "../services/RegistrarProdutoService";

export class RegistrarProdutoController {
    async handle(req: Request, res: Response) {
        const {
            nomeCategoria, 
            cpf_cnpj, 
            nomeProduto, valor, 
            tipoProduto
        } = req.body;

        const registrarProdutoService = new RegistrarProdutoService();

        try {
            const produto = await registrarProdutoService.execute({ nomeCategoria, cpf_cnpj, nomeProduto, valor, tipoProduto });

            return res.status(produto.status).json(produto);
        } catch (error) {
            console.error(`Erro ao registar produto ${error}`);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ message: `Erro ao registrar o produto: ${error}` });
        }
    }
}
