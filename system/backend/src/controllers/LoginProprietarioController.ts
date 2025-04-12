import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
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
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
        }
    }
}