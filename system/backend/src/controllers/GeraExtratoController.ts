import { Request, Response } from "express";
import { GeraExtratoService } from "../services/GeraExtratoService.js";

class GeraExtratoController {
    async handle(request: Request, response: Response) {
        const {idEmpresa } = request.body;

        const geraExtratoService = new GeraExtratoService();

        const extrato = await geraExtratoService.execute({ idEmpresa });

        return response.json(extrato);
    }
}
export {GeraExtratoController};
