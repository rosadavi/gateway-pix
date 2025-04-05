import prismaClient from "../prisma";

interface GeraExtratoProps {
    idPedido: number;
}

class GeraExtratoGeralService {
    async execute({ idPedido }: GeraExtratoProps) {
        try {
            const pedidos = await prismaClient.pedido.findUnique({
                where: {
                    idPedido
                },
                include: {
                    pagamento: true,
                    item_pedido: {
                        include: {
                            produto_item: true,
                        },
                    },
                },
            });

            if (!pedidos) {
                throw new Error("not found: Nenhum pedido encontrado para a Pedido");
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