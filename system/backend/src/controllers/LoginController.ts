import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";

class LoginController {
    async handle(request: Request, response: Response) {
        const { cnpj_cpf, senha } = request.body;

        const loginService = new LoginService();

        try {
            const token = await loginService.execute({ cnpj_cpf, senha });
            return response.json(token);
        } catch (error: any) {
            if (error.message.includes("validation")) {
                return response.status(400).json({ message: "Erro de validação: " + error.message });
            }
            if (error.message.includes("invalid credentials")) {
                return response.status(401).json({ message: "Erro de autenticação: " + error.message });
            }
            return response.status(500).json({
                message: "Erro ao realizar login",
                error: error.message,
            });
        }
    }
}
export { LoginController };