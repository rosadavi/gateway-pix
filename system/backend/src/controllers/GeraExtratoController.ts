import { Request, Response } from "express";
import { GeraExtratoService } from "../services/GeraExtratoService.js";

class GeraExtratoController {
    async handle(request: Request, response: Response) {
        const { empresa_id_empresa } = request.body;

        const geraExtratoService = new GeraExtratoService();

        const extrato = await geraExtratoService.execute({ empresa_id_empresa });

        return response.json(extrato);
    }
}
export {GeraExtratoController};
