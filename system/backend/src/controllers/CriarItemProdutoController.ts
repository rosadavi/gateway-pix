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
            cpf_cnpj_empresa
        } = req.body;

        const criarItemProdutoService = new CriarItemProdutoService();

        try {
            const item = await criarItemProdutoService.execute( {
                cnpj_cpf,
                descricao_item,
                valor_item,
                item_ativo,
                nomeProduto,
                cpf_cnpj_empresa
            } );

            return res.status(201).json({
                message: "Item registrado com sucesso",
                item,
            });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao registrar o item",
            });
        }
    }
}

export { CriarItemProdutoController };