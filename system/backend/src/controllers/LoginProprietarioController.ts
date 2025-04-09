import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";

export class LoginProprietarioController {
    async handle(req: Request, res: Response) {
        const { 
            cnpj_cpf, 
            senha 
        } = req.body;

        const loginService = new LoginService();

        try {
            const token = await loginService.execute({ cnpj_cpf, senha });

            return res.status(token.status).json(token);   
        } catch (error) {
            console.error(`Erro ao realizar login ${error}`);
            return res.status(500).json({ error: "Credenciais Invalidas" })
        }
    }
}