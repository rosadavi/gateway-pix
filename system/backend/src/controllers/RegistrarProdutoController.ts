import { Request, Response } from "express";
import { RegistrarProdutoService } from "../services/RegistrarProdutoService";

class RegistrarProdutoController {
    async handle(request: Request, response: Response) {
        const {
            Categoria_idCategoria, Empresa_idEmpresa, nomeProduto, valor, tipoProduto, descricao_item, valor_item } = request.body;

        const registrarProdutoService = new RegistrarProdutoService();

        try {
            const produto = await registrarProdutoService.execute({
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
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao registrar o produto",
                error: error.message,
            });
        }
    }
}

export { RegistrarProdutoController };
