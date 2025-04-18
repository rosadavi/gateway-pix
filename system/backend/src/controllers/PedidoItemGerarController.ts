import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { PedidoItemGerarService } from "../services/PedidoItemGerarService";

export class PedidoItemGerarController {
    async handle(req: Request, res: Response) {
        const {
            telefone_empresa,
            telefone_cliente,
            nome_cliente,
            metodo_pagamento, 
            descricao_cobranca, 
            num_parcelas, 
            itens_pedido
        } = req.body;

        const pedidoItemGerarService = new PedidoItemGerarService();

        try {
            const cobranca = await pedidoItemGerarService.execute({ telefone_empresa, telefone_cliente, nome_cliente, metodo_pagamento, descricao_cobranca, num_parcelas, itens_pedido });
            return res.json(cobranca);
        } catch(error) {
            console.error("Erro ao criar uma cobranca com itens " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({error: "Erro ao criar uma cobranca com itens " + error});
        }
    }
}
 