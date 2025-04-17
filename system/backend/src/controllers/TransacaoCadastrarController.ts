import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { TransacaoCadastrarService } from "../services/TransacaoCadastrarService";

export class  TransacaoCadastrarController {
    async handle(req: Request, res: Response) {
        const { siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao } = req.body;

        const transacaoCadastrarService = new TransacaoCadastrarService();

        try {
            const tipoTransacao = await transacaoCadastrarService.execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao });
            return res.status(tipoTransacao.status).json(tipoTransacao);
        } catch (error) {
            console.error("Erro ao criar tipo de transação " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({  error: "Erro ao criar o tipo de transação" + error });
        }
    }
}
