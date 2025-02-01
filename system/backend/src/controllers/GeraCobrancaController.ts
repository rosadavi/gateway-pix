import { Request, Response } from "express";
import { GeraCobrancaService } from "../services/GeraCobrancaService.js";

class GeraCobrancaController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido } = request.body;

        const geraCobrancaService = new GeraCobrancaService();

        const cobranca = await geraCobrancaService.execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido });

        return response.json(cobranca);
    }
}
export {GeraCobrancaController};
