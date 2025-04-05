import prismaClient from "../prisma";

interface CriarExtratoDetalhadoProps {
    cpf_cnpj: string;
}

export class CriarExtratoDetalhadoService {
    async execute({ cpf_cnpj }: CriarExtratoDetalhadoProps) {
        try {
            const empresa = await prismaClient.empresa.findFirst({
                where: {
                    empCpfCnpj: cpf_cnpj
                }
            });

            if(!empresa) throw new Error("not_found: Empresa nao cadastrada");

            const pedido = await prismaClient.pedido.findMany({
                where: {
                    empresa_idEmpresa: empresa.idEmpersa
                }
            });

            const pedidoItens = await prismaClient.item_pedido.findMany({
                where: {
                    
                }
            })

            console.log(pedido);


            return { status: 204, data: { pedido }};
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if(error.message.includes("not_found")) return { status: 404, message: error.message }
            return { status: 500, message: `Erro ao criar extrato ${error.message}` };
        }
    }
}