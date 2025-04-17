import prismaClient from "../prisma";

interface ExtratoGerarProps {
    idEmpresa: number;
}

export class ExtratoGerarService {
    async execute({ idEmpresa }: ExtratoGerarProps) {
        try {
            console.log(idEmpresa);
            const extrato = await prismaClient.pedido.findMany({
                where: {                    
                        empresa_idEmpresa: idEmpresa
                },
                select: {
                    idPedido: true,
                    dataRegistro: true,
                    valorTotal: true,
                    status: true,
                    pessoa_idPessoa_cliente: true,                }
            });

            if (extrato.length === 0) {
                throw new Error("not found: Nenhum pedido encontrado para a empresa");
            }

            return { status: 200, data: extrato };
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao gerar extrato: " + error.message);
        }
    }
}
