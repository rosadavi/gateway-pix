import { Request, Response } from "express";
import { CriarItemProdutoService } from "../services/CriarItemProdutoService";
import { validateToken } from "../middlewares/jwt";

class CriarItemProdutoController {
    async handle(req: Request, res: Response) {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token not found" });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = validateToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { cpf_cnpj_empresa } = decodedToken;

        const {
            cnpj_cpf,
            descricao_item,
            valor_item,
            item_ativo,
            nomeProduto
        } = req.body;

        const criarItemProdutoService = new CriarItemProdutoService();

        try {
            const item = await criarItemProdutoService.execute( {
                cnpj_cpf,
                descricao_item,
                valor_item,
                item_ativo,
                cpf_cnpj_empresa,
                nomeProduto
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