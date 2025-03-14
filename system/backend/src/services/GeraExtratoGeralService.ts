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


            return { status: 200, data: { pedidos }};
        } catch (error) {
            console.error("Erro ao gerar extrato: ", error);
            return { status: 500, message: "Erro ao gerar extrato", error: (error as any).message };
        }
    }
}

export { GeraExtratoProps, GeraExtratoGeralService }