import prismaClient from "../prisma";

interface TipoTransacaoProps {
    siglaTipoTransacao: string;
    nomeTipoTransacao: string;
    descTipoTransacao: string;
}

class CriarTipoTransacaoService {
    async execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao }: TipoTransacaoProps) {
        try {
            const transacaoExistente = await prismaClient.tipoTransacao.findUnique({
                where: { siglaTipoTransacao },
            });

            if (transacaoExistente) {
                throw new Error("duplicate: Tipo de transação já existe");
            }

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const novaTransacao = await prisma.tipoTransacao.create({
                    data: {
                        siglaTipoTransacao,
                        nomeTipoTransacao,
                        descTipoTransacao
                    }
                });

                return novaTransacao;
            });

            return { status: 201, data: transaction };
        } catch (error: any) {
            console.error("Erro ao criar transação: ", error);
            if (error.message.includes("duplicate")) {
                throw new Error("duplicate: Tipo de transação já existe");
            }
            throw new Error("Erro ao criar transação: " + error.message);
        }
    }
}

export { CriarTipoTransacaoService };