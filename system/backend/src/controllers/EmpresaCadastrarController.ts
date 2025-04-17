import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { EmpresaCadastrarService } from "../services/EmpresaCadastrarService";

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

        const empresaCadastrarService = new EmpresaCadastrarService();

        try {
            const proprietario = await empresaCadastrarService.execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj });
            return res.status(proprietario.status).json(proprietario);
        } catch (error) {
            console.error("Erro ao criar proprietario " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({ error: "Erro ao criar o proprietario" + error });
        }
    }
}
