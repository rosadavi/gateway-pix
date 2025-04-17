import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ProdutoItemCadastrarService } from "../services/ProdutoItemCadastrarService";

export class ProdutoItemCadastrarController {
    async handle(req: Request, res: Response) {
        const {
            cnpj_cpf,
            descricao_item,
            valor_item,
            item_ativo,
            nomeProduto,
        } = req.body;

        const produtoItemCadastrarService = new ProdutoItemCadastrarService();

        try {
            const item = await produtoItemCadastrarService.execute({ cnpj_cpf, descricao_item, valor_item, item_ativo, nomeProduto });
            return res.status(item.status).json(item);
        } catch (error: any) {
            console.error("Erro ao criar um item " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar um item: " + error });
        }
    }
}
