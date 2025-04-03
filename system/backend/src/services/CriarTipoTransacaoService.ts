import prismaClient from "../prisma";

interface TipoTransacaoProps {
    siglaTipoTransacao: string;
    nomeTipoTransacao: string;
    descTipoTransacao: string;
}

class CriarTipoTransacaoService {
    async execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao }: TipoTransacaoProps) {
       try{
        const tipoTransacao = await prismaClient.tipoTransacao.findFirst({
            where: {
                siglaTipoTransacao,
                nomeTipoTransacao
            }
        });

        if(tipoTransacao) throw new Error("duplicate: Tipo de transacao ja cadastrado");

        const transaction = await prismaClient.$transaction(async (prisma) => {
            const novaTransacao = await prisma.tipoTransacao.create({
                data: {
                    siglaTipoTransacao,
                    nomeTipoTransacao,
                    descTipoTransacao
                }
            });

            return novaTransacao
    });

        return { status: 201, data: transaction };
    } catch (error: any) {
        console.error("Erro ao criar transacao: ", error);
        if(error.message.includes("duplicate")) return { status: 409, message: error.message }
        return { status: 500, message: "Erro ao criar transacao", error: (error as any).message };
    }
}
}

export { CriarTipoTransacaoService };