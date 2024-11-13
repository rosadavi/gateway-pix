import { Request, Response } from "express";
import { GeraCobrancaUnicaService } from "../services/GeraCobrancaUnicaService.js";

class GeraCobrancaUnicaController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa, pedido_id_pedido, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela } = request.body;

        const geraCobrancaUnicaService = new GeraCobrancaUnicaService();

        const cobranca = await geraCobrancaUnicaService.execute({ empresa_id_empresa, pedido_id_pedido, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela });

        return response.json(cobranca);
    }
}
export {GeraCobrancaUnicaController};
