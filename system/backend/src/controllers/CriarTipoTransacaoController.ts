import { Request, Response } from "express";
import { CriarTipoTransacaoService } from "../services/CriarTipoTransacaoService.js";

class  CriarTipoTransacaoController {
    async handle(req: Request, res: Response) {
        const { 
            siglaTipoTransacao, 
            nomeTipoTransacao, 
            descTipoTransacao 
        } = req.body;

        const crairTipoTransacao = new CriarTipoTransacaoService();

        try {
            const tipoTransacao = await crairTipoTransacao.execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao});

            return res.status(tipoTransacao.status).json(tipoTransacao);   
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar tipo de transacao" });
        }
    }
}
export { CriarTipoTransacaoController };
