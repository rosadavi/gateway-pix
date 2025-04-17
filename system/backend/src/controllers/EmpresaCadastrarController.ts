import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CriarProprietarioService } from "../services/CriarProprietarioService.js";

export class EmpresaCadastrarController {
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
            console.error("Erro ao criar proprietario " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar o proprietario" + error });
        }
    }
}
