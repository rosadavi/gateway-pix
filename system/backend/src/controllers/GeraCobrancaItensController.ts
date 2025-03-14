import { Request, Response } from "express";
import { GeraCobrancaItensService } from "../services/GeraCobrancaItensService";

class GeraCobrancaItensController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido, id_empresa } = request.body;

        const geraCobrancaItensService = new GeraCobrancaItensService();

        const cobranca = await geraCobrancaItensService.execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido, id_empresa });

        return response.json(cobranca);
    }
}
export {GeraCobrancaItensController};
