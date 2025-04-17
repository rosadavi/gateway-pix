import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { EmpresaLoginService } from "../services/EmpresaLoginService";

export class EmpresaLoginController {
    async handle(req: Request, res: Response) {
        const { 
            cnpj_cpf, 
            senha 
        } = req.body;

        const empresaLoginService = new EmpresaLoginService();

        try {
            const token = await empresaLoginService.execute({ cnpj_cpf, senha });

            return res.status(token.status).json(token);   
        } catch (error) {
            console.error(`Erro ao realizar login ${error}`);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
        }
    }
}