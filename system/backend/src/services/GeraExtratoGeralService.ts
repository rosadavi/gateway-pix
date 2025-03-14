import prismaClient from "../prisma";

interface GeraExtratoProps {
    idEmpresa: number;
}

class GeraExtratoGeralService {
    async execute({ idEmpresa }: GeraExtratoProps) {
        try {
            const pedidos = await prismaClient.pedido.findMany({
                where: {
                    empresa_idEmpresa: idEmpresa
                },
                include: {
                    item_pedido: {
                        include: {
                            produto_item: true,
                        },
                    },
                },
            });

            if (pedidos.length === 0) {
                throw new Error("not found: Nenhum pedido encontrado para a empresa");
            }

            return { status: 200, data: { pedidos }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao gerar extrato: " + error.message);
        }
    }
}

export { GeraExtratoProps, GeraExtratoGeralService }