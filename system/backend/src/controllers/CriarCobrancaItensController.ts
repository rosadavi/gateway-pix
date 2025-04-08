import { Request, Response } from "express";
import { CriarCobrancaItensService } from "../services/CriarCobrancaItensService";

export class CriarCobrancaItensController {
    async handle(request: Request, response: Response) {
        const {
            telefone_empresa,
            telefone_cliente,
            nome_cliente,
            metodo_pagamento, 
            descricao_cobranca, 
            num_parcela, 
            num_parcelas, 
            itens_pedido
        } = request.body;

        const criarCobrancaItensService = new CriarCobrancaItensService();

        try {
            const cobranca = await criarCobrancaItensService.execute({ telefone_empresa, telefone_cliente, nome_cliente, metodo_pagamento, descricao_cobranca, num_parcela, num_parcelas, itens_pedido });
            return response.json(cobranca);
        } catch(error) {
            console.error("Erro ao criar uma cobranca com itens " + error);
            return response.status(500).json({error: "Erro ao criar uma cobranca com itens " + error});
        }
    }
}
 