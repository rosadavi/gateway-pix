import { Request, Response } from 'express';

import { CobrancaItemGerarService } from '../services/CobrancaItemGerarService';
import { AppError } from '../errors/AppError';

export class CobrancaItemGerarController {
    [x: string]: any;
    async handle(req: Request, res: Response) {
        const {
            idPedido,
            metodoPagamento,
            valorPagamento,
            descricaoPagamento,
            clienteTelefone,
            clienteNome
        } = req.body;

        const cobrancaItemGerarService = new CobrancaItemGerarService();

        try {
            const cobranca = await cobrancaItemGerarService.execute({
                idPedido,
                metodoPagamento,
                valorPagamento,
                descricaoPagamento,
                clienteTelefone,
                clienteNome
            });

            return res.status(200).json(cobranca);
        } catch (error) {
            console.error("Erro ao gerar uma cobranca com itens", error);
            if(error instanceof AppError) return res.status(error.statusCode).json(error.message);
            return res.status(500).json({error: error});
        }
    }
}