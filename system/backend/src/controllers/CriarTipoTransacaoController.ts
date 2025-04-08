import { Request, Response } from "express";
import { CriarTipoTransacaoService } from "../services/CriarTipoTransacaoService.js";

class  CriarTipoTransacaoController {
    async handle(request: Request, response: Response) {
        const { siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao } = request.body;

        const criarTipoTransacaoService = new CriarTipoTransacaoService();

        try {
            const tipoTransacao = await criarTipoTransacaoService.execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao });
            return response.status(tipoTransacao.status).json(tipoTransacao);
        } catch (error) {
            console.error("Erro ao criar tipo de transação " + error);
            return response.status(500).json({
                message: "Erro ao criar o tipo de transação" + error
            });
        }
    }
}
export { CriarTipoTransacaoController };
