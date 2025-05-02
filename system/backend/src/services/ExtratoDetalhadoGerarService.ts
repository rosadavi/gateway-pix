import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface ExtratoDetalhadoGerarProps {
    idEmpresa: number;
    pedidoEspecifico: number | null;
}

const codigoErro = "EDGS";

export class ExtratoDetalhadoGerarService {
    async execute({ idEmpresa, pedidoEspecifico }: ExtratoDetalhadoGerarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    idEmpresa
                }
            });

            if(!empresa) throwError("not_found:empresa", codigoErro);
            if(pedidoEspecifico == null) throwError("invalid:id_pedido", codigoErro);

            const totalPedidos = await prismaClient.pedido.count({
                where: {
                    empresa: {
                        idEmpresa: empresa.idEmpresa
                    }
                }
            });

            const pedido = await prismaClient.pedido.findMany({
                where: {
                    empresa: {
                        idEmpresa: empresa.idEmpresa
                    },
                    idPedido: pedidoEspecifico
                },
                include: {
                    pagamento: true,
                    item_pedido: {
                        include: {
                            produto_item: {
                                include: {
                                    produto: true
                                }
                            }
                            
                        }
                    }
                }
            });
            
            return { status: 200, data: { total_pedidos: totalPedidos, pedido }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if(error instanceof AppError) throw error;
            return { 
                status: 500, 
                error: "Erro ao criar extrato: " + error.message 
            };
        }
    }
}