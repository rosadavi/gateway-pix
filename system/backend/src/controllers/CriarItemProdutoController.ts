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
            if (error.message.includes("validation")) {
                return res.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return res.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            return res.status(500).json({
                message: "Erro ao registrar o item",
                error: error.message,
            });
        }
    }
}

export { CriarItemProdutoController };