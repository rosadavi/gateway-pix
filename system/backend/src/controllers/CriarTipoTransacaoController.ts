import { Request, Response } from "express";
import { CriarTipoTransacaoService } from "../services/CriarTipoTransacaoService.js";

class  CriarTipoTransacaoController {
    async handle(request: Request, response: Response) {
        const { siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao } = request.body;

        const criarTipoTransacaoService = new CriarTipoTransacaoService();

        try {
            const tipoTransacao = await criarTipoTransacaoService.execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao });
            return response.json(tipoTransacao);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao criar o tipo de transação",
                error: error.message,
            });
        }
    }
}
export { CriarTipoTransacaoController };
