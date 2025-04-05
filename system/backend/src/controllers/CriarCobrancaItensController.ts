import { Request, Response } from "express";
import { CriarCobrancaItensService } from "../services/CriarCobrancaItensService";

export class CriarCobrancaItensController {
    async handle(request: Request, response: Response) {
        const {
            cpf_cnpj,
            telefone_cliente,
            nome_cliente,
            metodo_pagamento, 
            descricao_cobranca, 
            num_parcela, 
            num_parcelas, 
            itens_pedido
        } = request.body;

        const criarCobrancaItensService = new CriarCobrancaItensService();

        const cobranca = await criarCobrancaItensService.execute({ cpf_cnpj, telefone_cliente, nome_cliente, metodo_pagamento, descricao_cobranca, num_parcela, num_parcelas, itens_pedido });

        return response.json(cobranca);
    }
}
 