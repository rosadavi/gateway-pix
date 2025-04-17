import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CriarExtratoDetalhadoService } from "../services/CriarExtratoDetalhadoService";

export class ExtratoGerarDetalhadoController {
    async handle(req: Request, res: Response) {
        const { telefone_empresa, total } = req.body;

        const criarExtratoDetalhadoService = new CriarExtratoDetalhadoService();

        try {
            const extrato = await criarExtratoDetalhadoService.execute({ telefone_empresa, total });
            return res.status(extrato.status).json(extrato);
        } catch (error) {
            console.error("Erro ao criar um extrado detalhado " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar um extrado detalhado " + error });
        }
    }
}