import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { ExtratoDetalhadoGerarService } from "../services/ExtratoDetalhadoGerarService";
import { getUserIdFromToken } from "../configs/session";

export class ExtratoDetalhadoGerarController {
    async handle(req: Request, res: Response) {
        const { pedidoEspecifico } = req.body;

        const extratoDetalhadoGerarService = new ExtratoDetalhadoGerarService();

        try {
            const idEmpresa = await getUserIdFromToken(req);
            const extrato = await extratoDetalhadoGerarService.execute({ idEmpresa, pedidoEspecifico });
            return res.status(extrato.status).json(extrato);
        } catch (error) {
            console.error("Erro ao criar um extrado detalhado " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message, status: error.source});
            return res.status(500).json({ error: "Erro ao criar um extrado detalhado " + error });
        }
    }
}