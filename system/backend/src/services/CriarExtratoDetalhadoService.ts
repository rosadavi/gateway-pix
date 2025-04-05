import prismaClient from "../prisma";

interface CriarExtratoDetalhadoProps {
    idPedido: number;
}

export class CriarExtratoDetalhadoService {
    async execute({ idPedido }: CriarExtratoDetalhadoProps) {
        try {
            

            const pedido = await prismaClient.pedido.findMany({
                where: {
                    idPedido
                    
                },
                include: {
                    pagamento: true,
                    item_pedido: true
                }
            });
            
            return { status: 200, data: { pedido }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if(error.message.includes("not_found")) return { status: 404, message: error.message }
            return { status: 500, message: `Erro ao criar extrato ${error.message}` };
        }
    }
}