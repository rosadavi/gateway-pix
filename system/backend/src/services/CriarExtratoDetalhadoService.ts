import prismaClient from "../prisma";

interface CriarExtratoDetalhadoProps {
    telefone_empresa: number;
    total: number;
}

export class CriarExtratoDetalhadoService {
    async execute({ telefone_empresa, total }: CriarExtratoDetalhadoProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    telefone_empresa
                }
            });

            const totalPedidos = await prismaClient.pedido.count({
                where: {
                    empresa: {
                        idEmpresa: empresa.idEmpresa
                    }
                }
            });

            const pedidos = await prismaClient.pedido.findMany({
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
                take: total
            });
            
            return { status: 200, data: { total_pedidos: totalPedidos, pedidos }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if(error.message.includes("not_found")) return { status: 404, message: error.message }
            return { status: 500, message: `Erro ao criar extrato ${error.message}` };
        }
    }
}