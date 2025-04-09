import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface CriarExtratoDetalhadoProps {
    telefone_empresa: string;
    pedidoEspecifico: number | null;
}

export class CriarExtratoDetalhadoService {
    async execute({ telefone_empresa, pedidoEspecifico }: CriarExtratoDetalhadoProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    telefoneEmpresa: telefone_empresa
                }
            });

            if(!empresa) throwError("not_found:empresa");

            const totalPedidos = await prismaClient.pedido.count({
                where: {
                    empresa: {
                        idEmpresa: empresa.idEmpresa
                    }
                }
            });

            let pedidos;

            if(pedidoEspecifico !== null) {
                pedidos = await prismaClient.pedido.findMany({
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
            } else {
                pedidos = await prismaClient.pedido.findMany({
                    where: {
                        empresa: {
                            idEmpresa: empresa.idEmpresa
                        }
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
                    orderBy: {
                        dataRegistro: "desc"
                    },
                    take: 10
                });
            }
            
            return { status: 200, data: { total_pedidos: totalPedidos, pedidos }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if(error instanceof AppError) throw Error;
            return { 
                status: 500, 
                error: "Erro ao criar extrato: " + error.message 
            };
        }
    }
}