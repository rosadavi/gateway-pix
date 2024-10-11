import { Request, Response } from "express";
import { VerificaCPFeCNPJService } from "../services/VerificaCPFeCNPJService.js";

class VerificaCPFeCNPJController {
    async handle(request: Request, response: Response) {
        const { numero } = request.body;

        const verificaCPFeCNPJService = new VerificaCPFeCNPJService();

        const verificacao = await verificaCPFeCNPJService.execute({ numero });

        return response.json(verificacao);
    }
}
export {VerificaCPFeCNPJController};