import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CriarCobrancaItensService } from "../services/CriarCobrancaItensService";

export class CriarCobrancaItensController {
    async handle(req: Request, res: Response) {
        const {
            telefone_empresa,
            telefone_cliente,
            nome_cliente,
            metodo_pagamento, 
            descricao_cobranca, 
            num_parcela, 
            num_parcelas, 
            itens_pedido
        } = req.body;

        const criarCobrancaItensService = new CriarCobrancaItensService();

        try {
            const cobranca = await criarCobrancaItensService.execute({ telefone_empresa, telefone_cliente, nome_cliente, metodo_pagamento, descricao_cobranca, num_parcela, num_parcelas, itens_pedido });
            return res.json(cobranca);
        } catch(error) {
            console.error("Erro ao criar uma cobranca com itens " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({error: "Erro ao criar uma cobranca com itens " + error});
        }
    }
}
 