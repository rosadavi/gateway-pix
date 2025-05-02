import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ProdutoItemCadastrarService } from "../services/ProdutoItemCadastrarService";
import { getUserIdFromToken } from "../configs/session";

export class ProdutoItemCadastrarController {
    async handle(req: Request, res: Response) {
        const {
            descricao_item,
            valor_item,
            item_ativo,
            nomeProduto,
        } = req.body;

        const produtoItemCadastrarService = new ProdutoItemCadastrarService();

        try {
            const idEmpresa = await getUserIdFromToken(req);
            const item = await produtoItemCadastrarService.execute({ idEmpresa, descricao_item, valor_item, item_ativo, nomeProduto });
            return res.status(item.status).json(item);
        } catch (error: any) {
            console.error("Erro ao criar um item " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar um item: " + error });
        }
    }
}
