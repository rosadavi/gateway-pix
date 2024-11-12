import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";

class LoginController {
    async handle(request: Request, response: Response) {
        const { cnpj_cpf, senha } = request.body;

        const loginService = new LoginService();

        const token = await loginService.execute({ cnpj_cpf, senha });

        return response.json(token);
    }
}
export { LoginController };