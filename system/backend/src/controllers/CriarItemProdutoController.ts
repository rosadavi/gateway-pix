import { Request, Response } from "express";
import { CriarItemProdutoService } from "../services/CriarItemProdutoService";

class CriarItemProdutoController {
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
            return res.status(500).json({message: `Erro ao criar item ${error.message}`});
        }
    }
}

export { CriarItemProdutoController };