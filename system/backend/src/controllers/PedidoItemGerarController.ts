import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { PedidoItemGerarService } from "../services/PedidoItemGerarService";
import { getUserIdFromToken } from "../configs/session";

export class PedidoItemGerarController {
    async handle(req: Request, res: Response) {
        const {
            telefone_cliente,
            nome_cliente,
            num_parcelas, 
            itens_pedido
        } = req.body;

        const pedidoItemGerarService = new PedidoItemGerarService();

        try {
            const idEmpresa = await getUserIdFromToken(req);
            const cobranca = await pedidoItemGerarService.execute({ idEmpresa, telefone_cliente, nome_cliente, num_parcelas, itens_pedido });
            console.log("Sessão completa:", req.session);
            console.log("Token recebido:", req.body.token);
            console.log("ID Empresa resolvido:", idEmpresa);            
            return res.json(cobranca);
        } catch(error) {
            console.error("Erro ao criar uma cobranca com itens " + error);
            if(error instanceof AppError) return res.status(error.statusCode).json({error: error.message});
            return res.status(500).json({error: "Erro ao criar uma cobranca com itens " + error});
        }
    }
}
 