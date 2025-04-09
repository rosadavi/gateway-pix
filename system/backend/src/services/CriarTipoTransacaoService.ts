import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface TipoTransacaoProps {
    siglaTipoTransacao: string;
    nomeTipoTransacao: string;
    descTipoTransacao: string;
}

export class CriarTipoTransacaoService {
    async execute({ siglaTipoTransacao, nomeTipoTransacao, descTipoTransacao }: TipoTransacaoProps) {
        try {
            const transacaoExistente = await prismaClient.tipoTransacao.findUnique({
                where: { siglaTipoTransacao },
            });

            if (transacaoExistente) throwError("duplicate:tipo_transacao");

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
            if (error instanceof AppError) throw Error;
            return {
                status: 500,
                error: "Erro ao criar transação: " + error.message
            };
        }
    }
}
