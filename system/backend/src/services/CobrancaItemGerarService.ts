import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface CobrancaItemGerarProps {
    idPedido: number,
    metodoPagamento: String,
    valorPagamento: number,
    descricaoPagamento: String,
    clienteTelefone: String,
    clienteNome: String
}

export class CobrancaItemGerarService {
    async execute({
        idPedido,
        metodoPagamento,
        valorPagamento,
        descricaoPagamento,
        clienteTelefone,
        clienteNome
    }: CobrancaItemGerarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: { telefoneEmpresa: clienteTelefone },
            });

            if(!empresa) throwError("not_found:empresa");

            const transaction = await prismaClient.$transaction(async(prisma) => {
                const cobranca = await prisma.pagamento.create({
                    data: {
                        pedido_idPedido: idPedido,
                        pag_tipo: metodoPagamento,
                        pag_method: metodoPagamento,
                        pag_valor: valorPagamento,
                        pag_descricao: descricaoPagamento,
                        parcela_numero: 1,
                        cliente_telefone: clienteTelefone,
                        cliente_nome: clienteNome
                    }
                });

                return cobranca;
            });

            return {
                status: 201,
                data: transaction
            }
        } catch (error: any) {
            console.error("Erro ao gerar uma cobranca com itens", error);
            if(error instanceof AppError) throw error;
            return {
                status: 500,
                error: "Erro ao gerar uma cobranca com itens"
            };
        }
    }
}