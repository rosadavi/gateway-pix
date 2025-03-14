import { Request, Response } from "express";
import { CriarUsuarioService } from "../services/CriarUsuarioService.js";

class CriarUsuarioController {
    async handle(request: Request, response: Response) {
        const { nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj } = request.body;

        const criarUsuarioService = new CriarUsuarioService();

        try {
            const usuario = await criarUsuarioService.execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj });
            return response.status(201).json(usuario);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("duplicate")) {
                return response.status(409).json({ message: "Erro de duplicidade: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao criar o usuário",
                error: error.message,
            });
        }
    }
}
export { CriarUsuarioController };
