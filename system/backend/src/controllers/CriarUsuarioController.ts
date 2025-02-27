import { Request, Response } from "express";
import { CriarUsuarioService } from "../services/CriarUsuarioService.js";

class CriarUsuarioController {
    async handle(request: Request, response: Response) {
        const { nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj } = request.body;

        const criarUsuarioService = new CriarUsuarioService();

        try {
            const usuario = await criarUsuarioService.execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj });
            return response.json(usuario);
        } catch (error) {
            return response.status(500).json({ message: "Erro ao criar o usuário", error });
        }
    }
}
export { CriarUsuarioController };
