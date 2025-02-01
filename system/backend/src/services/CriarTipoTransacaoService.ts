import prismaClient from "../prisma";

interface TipoTransacaoProps {
    siglaTipoTransacao: string;
    nomeTipoTransacao: string;
    descTipoTransacao: string;
}

class CriarTipoTransacaoService {
    async execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao }: TipoTransacaoProps) {
       try{

        const transaction = await prismaClient.$transaction(async (prisma) => {
            const novaTransacao = await prismaClient.tipoTransacao.create({
                data: {
                    siglaTipoTransacao,
                    nomeTipoTransacao,
                    descTipoTransacao
                }
            });

            return novaTransacao
    });

        return { status: 201, data: transaction };
    } catch (error) {
        console.error("Erro ao criar transacao: ", error);
        return { status: 500, message: "Erro ao criar transacao", error: (error as any).message };
    }
}
}

export { CriarTipoTransacaoService };