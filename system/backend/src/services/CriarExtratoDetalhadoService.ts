import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface CriarExtratoDetalhadoProps {
    telefone_empresa: string;
    total: number;
}

export class CriarExtratoDetalhadoService {
    async execute({ telefone_empresa, total }: CriarExtratoDetalhadoProps) {
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
                                select: {
                                    produto_idProduto: true,
                                        
                                                
                                            }
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
            if(error instanceof AppError) throw error;
            return { 
                status: 500, 
                error: "Erro ao criar extrato: " + error.message 
            };
        }
    }
}