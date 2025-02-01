import { Request, Response } from "express";
import { CriarTipoTransacaoService } from "../services/CriarTipoTransacaoService.js";

class  CriarTipoTransacaoController {
    async handle(request: Request, response: Response) {
        const { siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao } = request.body;

        const crairTipoTransacao = new CriarTipoTransacaoService();

        const tipoTransacao = await crairTipoTransacao.execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao});

        return response.json(tipoTransacao);
    }
}
export { CriarTipoTransacaoController };
