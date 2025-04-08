import { Request, Response } from "express";
import { CriarExtratoDetalhadoService } from "../services/CriarExtratoDetalhadoService";

export class CriarExtratoDetalhadoController {
    async handle(req: Request, res: Response) {
        const { telefone_empresa, total } = req.body;

        const criarExtratoDetalhadoService = new CriarExtratoDetalhadoService();

        try {
            const extrato = await criarExtratoDetalhadoService.execute({ telefone_empresa, total });
            return res.status(extrato.status).json(extrato);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            return res.status(500).json({ message: "Erro ao criar um extrado detalhado", error: errorMessage });
        }
    }
}