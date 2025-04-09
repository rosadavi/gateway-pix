import { Request, Response } from "express";
import { CriarItemProdutoService } from "../services/CriarItemProdutoService";

export class CriarItemProdutoController {
    async handle(req: Request, res: Response) {
        const {
            cnpj_cpf,
            descricao_item,
            valor_item,
            item_ativo,
            nomeProduto,
        } = req.body;

        const criarItemProdutoService = new CriarItemProdutoService();

        try {
            const item = await criarItemProdutoService.execute({ cnpj_cpf, descricao_item, valor_item, item_ativo, nomeProduto });
            return res.status(item.status).json(item);
        } catch (error: any) {
            console.error("Erro ao criar um item " + error);
            return res.status(500).json({ error: "Erro ao criar um item: " + error });
        }
    }
}
