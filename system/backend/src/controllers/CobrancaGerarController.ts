import { Request, Response } from "express";
import { GeraCobrancaService } from "../services/GeraCobrancaService.js";

export class CobrancaGerarController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas } = request.body;

        const geraCobrancaService = new GeraCobrancaService();

        try {
            const cobranca = await geraCobrancaService.execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas });
            return response.json(cobranca);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao gerar a cobrança",
                error: error.message,
            });
        }
    }
}
