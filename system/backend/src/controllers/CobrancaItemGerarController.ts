import { Request, Response } from 'express';

import { CobrancaItemGerarService } from '../services/CobrancaItemGerarService';
import { AppError } from '../errors/AppError';
import { getUserIdFromToken } from '../configs/session';

export class CobrancaItemGerarController {
    async handle(req: Request, res: Response) {
        const {
            pag_tipo,
            pag_method,
            pag_descricao,
            telefone_cliente, 
            nome_cliente, 
            num_parcelas, 
            itens_pedido
        } = req.body;

        const cobrancaItemGerarService = new CobrancaItemGerarService();

        try {
            const idEmpresa = await getUserIdFromToken(req);
            const cobranca = await cobrancaItemGerarService.execute({
                idEmpresa,
                pag_tipo,
                pag_method,
                pag_descricao,
                telefone_cliente, 
                nome_cliente, 
                num_parcelas, 
                itens_pedido
            });

            return res.status(cobranca.status).json(cobranca);
        } catch (error) {
            console.error("Erro ao gerar uma cobranca com itens", error);
            if(error instanceof AppError) return res.status(error.statusCode).json(error.message);
            return res.status(500).json({error: error});
        }
    }
}