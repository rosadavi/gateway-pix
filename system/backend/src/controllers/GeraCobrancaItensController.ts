import { Request, Response } from "express";
import { GeraCobrancaItensService } from "../services/GeraCobrancaItensService";

class GeraCobrancaItensController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa, telefone_cliente, metodo_pagamento, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido, id_empresa } = request.body;

        const geraCobrancaItensService = new GeraCobrancaItensService();

        try {
            const cobranca = await geraCobrancaItensService.execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido, id_empresa });
            return response.json(cobranca);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            if (error.message.includes("not found")) {
                return response.status(404).json({ message: "Erro: Item não encontrado: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao gerar a cobrança",
                error: error.message,
            });
        }
    }
}
export {GeraCobrancaItensController};
