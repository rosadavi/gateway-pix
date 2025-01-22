import { Request, Response } from "express";
import { RegistrarPedidoService } from "../services/RegistrarPedidoService";

class RegistrarPedidoController {
  async handle(request: Request, response: Response) {
    const {
      clienteId,
      empresaId,
      produtos,
      nomeCliente,
      pessoaRegistrouId,
      totalParcelas,
      vencimentoPrimeiraParcela,
    } = request.body;

    const registrarPedidoService = new RegistrarPedidoService();

    try {
      const pedido = await registrarPedidoService.execute({
        clienteId,
        empresaId,
        produtos,
        nomeCliente,
        pessoaRegistrouId,
        totalParcelas,
        vencimentoPrimeiraParcela,
      });

      return response.status(201).json({
        message: "Pedido registrado com sucesso",
        pedido,
      });
    } catch (error: any) {
      return response.status(400).json({
        message: error.message || "Erro ao registrar o pedido",
      });
    }
  }
}

export { RegistrarPedidoController };
