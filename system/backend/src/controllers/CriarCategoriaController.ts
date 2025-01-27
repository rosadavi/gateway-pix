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
            return response.status(500).json({ message: "Erro ao criar o usuário", error });
        }
    }
}
export { CriarCategoriaController };
