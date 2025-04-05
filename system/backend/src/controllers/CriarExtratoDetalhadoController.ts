import { Request, Response } from "express";
import { CriarExtratoDetalhadoService } from "../services/CriarExtratoDetalhadoService";

export class CriarExtratoDetalhadoController {
    async handle(req: Request, res: Response) {
        const { cpf_cnpj } = req.body;

        const criarExtratoDetalhadoService = new CriarExtratoDetalhadoService();

        try {
            const extrato = await criarExtratoDetalhadoService.execute({ cpf_cnpj });
            return res.status(extrato.status).json(extrato);
        } catch (error) {
            return res.status(500).json("Erro ao criar um extrado detalhado", error);
        }
    }
}