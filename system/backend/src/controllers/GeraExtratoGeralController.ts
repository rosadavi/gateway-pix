import { Request, Response } from "express";
import { GeraExtratoGeralService } from "../services/GeraExtratoGeralService.js";

class GeraExtratoGeralController {
    async handle(request: Request, response: Response) {
        const {idEmpresa } = request.body;

        const geraExtratoService = new GeraExtratoGeralService();

        const extrato = await geraExtratoService.execute({ idEmpresa });

        return response.json(extrato);
    }
}
export {GeraExtratoGeralController};
