import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface ExtratoDetalhadoGerarProps {
    telefone_empresa: string;
    pedidoEspecifico: number | null;
}

const codigoErro = "EDGS";

export class ExtratoDetalhadoGerarService {
    async execute({ telefone_empresa, pedidoEspecifico }: ExtratoDetalhadoGerarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    telefoneEmpresa: telefone_empresa
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
                    }
                },
                orderBy: {
                    idPedido: "asc"
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
                },
                skip: pedidoEspecifico - 1,
                take: 1,
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