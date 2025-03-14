import { Request, Response } from "express";
import { CriarCategoriaService } from "../services/CriarCategoriaService.js";

class CriarCategoriaController {
    async handle(request: Request, response: Response) {
        const { nomeCategoria } = request.body;

        const criarCategoriaService = new CriarCategoriaService();

        try {
            const categoria = await criarCategoriaService.execute({ nomeCategoria });
            return response.json(categoria);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("validation")) {
                    return response.status(400).json({ message: "Erro de validação: " + error.message });
                }
                if (error.message.includes("duplicate")) {
                    return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
                }
                return response.status(500).json({ message: "Erro ao criar a categoria", error: error.message });
            } else {
                console.error("Erro desconhecido ao criar a categoria:", error);
                return response.status(500).json({ message: "Erro desconhecido ao criar a categoria" });
            }
        }
    }
}

export { CriarCategoriaController };