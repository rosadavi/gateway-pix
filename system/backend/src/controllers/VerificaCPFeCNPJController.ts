import { Request, Response } from "express";
import { VerificaCPFeCNPJService } from "../services/VerificaCPFeCNPJService.js";

class VerificaCPFeCNPJController {
    async handle(request: Request, response: Response) {
        const { numero } = request.body;

        const verificaCPFeCNPJService = new VerificaCPFeCNPJService();

        try {
            const verificacao = await verificaCPFeCNPJService.execute({ numero });
            return response.json(verificacao);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("not found")) {
                return response.status(404).json({ message: "Erro: CPF ou CNPJ não encontrado: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao verificar CPF ou CNPJ",
                error: error.message,
            });
        }
    }
}
export {VerificaCPFeCNPJController};