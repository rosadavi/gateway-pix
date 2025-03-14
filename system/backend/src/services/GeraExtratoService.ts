import prismaClient from "../prisma";

interface GeraExtratoProps {
    idEmpresa: number;
}

class GeraExtratoService {
    async execute({ idEmpresa }: GeraExtratoProps) {
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
                    pessoa_idPessoa_cliente: true,
                }
            });

            return { status: 200, data: extrato };
        } catch (error) {
            console.error("Erro ao gerar extrato: ", error);
            return { status: 500, message: "Erro ao gerar extrato", error: (error as any).message };
        }
    }
}

export { GeraExtratoProps, GeraExtratoService }
