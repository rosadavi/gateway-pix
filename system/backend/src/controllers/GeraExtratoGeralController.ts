import { Request, Response } from "express";
import { GeraExtratoGeralService } from "../services/GeraExtratoGeralService.js";

class GeraExtratoGeralController {
    async handle(request: Request, response: Response) {
        const {idEmpresa } = request.body;

        const geraExtratoService = new GeraExtratoGeralService();

        try {
            const extrato = await geraExtratoService.execute({ idEmpresa });
            return response.json(extrato);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("not found")) {
                return response.status(404).json({ message: "Erro: Empresa não encontrada: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao gerar o extrato",
                error: error.message,
            });
        }
    }
}
export {GeraExtratoGeralController};
