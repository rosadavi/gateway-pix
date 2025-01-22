import { Request, Response } from "express";
import { RegistrarProdutoService } from "../services/RegistrarProdutoService";

class RegistrarProdutoController {
    async handle(request: Request, response: Response) {
        const {
            Categoria_idCategoria,
            Empresa_idEmpresa,
            nomeProduto,
            valor,
            tipoProduto,
            valor_perc_equivalente_pontos,
            valor_perc_equivalente_cashback,
            ativo,
            pontuaFidelidade,
            pontuaCashback,
            premioQtdProduto,
            premioQtdValor,
            expira_pontos_qtd_dias,
            expira_cashback_qtd_dias
        } = request.body;

        const registrarProdutoSErvice = new RegistrarProdutoService();

        try {
            const produto = await registrarProdutoSErvice.execute({
                Categoria_idCategoria,
                Empresa_idEmpresa,
                nomeProduto,
                valor,
                tipoProduto,
                valor_perc_equivalente_pontos,
                valor_perc_equivalente_cashback,
                ativo,
                pontuaFidelidade,
                pontuaCashback,
                premioQtdProduto,
                premioQtdValor,
                expira_pontos_qtd_dias,
                expira_cashback_qtd_dias
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
