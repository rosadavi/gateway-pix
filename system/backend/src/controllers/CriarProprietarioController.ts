import { Request, Response } from "express";
import { CriarProprietarioService } from "../services/CriarProprietarioService.js";

class CriarProprietarioController {
    async handle(req: Request, res: Response) {
        const {
            nome, 
            telefone, 
            email, 
            estado, 
            cidade, 
            tipo_pix, 
            chave_pix, 
            senha, 
            cpf_cnpj
        } = req.body;

        const criarProprietarioService = new CriarProprietarioService();

        try {
            const proprietario = await criarProprietarioService.execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj });
            return res.status(proprietario.status).json(proprietario);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar o proprietario", error });
        }
    }
}
export { CriarProprietarioController };
