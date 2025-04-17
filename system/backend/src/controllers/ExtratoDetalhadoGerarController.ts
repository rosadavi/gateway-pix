import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { ExtratoDetalhadoGerarService } from "../services/ExtratoDetalhadoGerarService";

export class ExtratoDetalhadoGerarController {
    async handle(req: Request, res: Response) {
        const { telefone_empresa, total } = req.body;

        const extratoDetalhadoGerarService = new ExtratoDetalhadoGerarService();

        try {
            const extrato = await extratoDetalhadoGerarService.execute({ telefone_empresa, total });
            return res.status(extrato.status).json(extrato);
        } catch (error) {
            console.error("Erro ao criar um extrado detalhado " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar um extrado detalhado " + error });
        }
    }
}