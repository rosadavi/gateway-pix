import { Request, Response } from "express";
import { RegistrarProdutoService } from "../services/RegistrarProdutoService";

class RegistrarProdutoController {
    async handle(request: Request, response: Response) {
        const {
            Categoria_idCategoria, Empresa_idEmpresa, nomeProduto, valor, tipoProduto, descricao_item, valor_item } = request.body;

        const registrarProdutoSErvice = new RegistrarProdutoService();

        try {
            const produto = await registrarProdutoSErvice.execute({
                Categoria_idCategoria,
                Empresa_idEmpresa,
                nomeProduto,
                valor,
                tipoProduto,
                descricao_item,
                valor_item
            });

            return response.status(201).json({
                message: "Produto registrado com sucesso",
                produto,
            });
        } catch (error: any) {
            return response.status(400).json({
                message: error.message || "Erro ao registrar o produto",
            });
        }
    }
}

export { RegistrarProdutoController };
