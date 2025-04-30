import { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import { EmpresaLoginService } from "../services/EmpresaLoginService";
import { saveSession } from "../configs/session";

export class EmpresaLoginController {
    async handle(req: Request, res: Response) {
        const { 
            telefone, 
            senha 
        } = req.body;

        const empresaLoginService = new EmpresaLoginService();

        try {
            const proprietario = await empresaLoginService.execute({ telefone, senha });
            const id = proprietario?.message?.id;
            await saveSession(req, id, proprietario.message!.token);
            return res.status(proprietario.status).json({token: proprietario.message?.token});
        } catch (error) {
            console.error(`Erro ao realizar login ${error}`);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
        }
    }
}