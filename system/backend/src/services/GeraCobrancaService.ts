import prismaClient from "../prisma";

interface GeraCobrancaProps {
    empresa_id_empresa: number;
    telefone_cliente: string;
    metodo_pagamento: string;
    valor_cobranca: number;
    status_cobranca: string;
    descricao_cobranca: string;
    num_parcela: number;
    num_parcelas: number;
}

class GeraCobrancaService {
    async execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas }: GeraCobrancaProps) {
        try {
            const cliente = await prismaClient.pessoa.findFirst({
                where: {
                    telefone: telefone_cliente
                }
                    
            });

            let cliente_id_cliente = null;
            let cliente_nome = null;

            if (!cliente) {
                const novoCliente = await prismaClient.pessoa.create({
                    data: {
                        telefone: telefone_cliente,
                        dataRegistro: new Date()
                    }
                });

                cliente_id_cliente = novoCliente.idPessoa;
                cliente_nome = "Cliente sem identificação";

            } else {
                cliente_id_cliente = cliente.idPessoa;
                cliente_nome = cliente.nomeCompleto;
            }

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const pedido = await prisma.pedido.create({
                    data: {
                        empresa_idEmpresa: empresa_id_empresa,
                        pessoa_idPessoa_cliente: cliente_id_cliente,
                        status: String(process.env.GTW_STATUS_PEDIDO),
                        valorTotal: valor_cobranca,
                        totalParcelas: num_parcelas,
                        pessoa_idPessoa_registrou: Number(process.env.GTW_ID_PESSOA_REGISTROU_COB)
                    }
                });

                const pedido_idPedido = pedido.idPedido;

                const cobranca = await prisma.pagamento.create({
                    data: {
                        pedido_idPedido,
                        pag_tipo: metodo_pagamento,
                        pag_method: metodo_pagamento,
                        pag_valor: valor_cobranca,
                        pag_descricao: descricao_cobranca,
                        pag_status: status_cobranca,
                        parcela_numero: num_parcela,
                        cliente_telefone: telefone_cliente,
                        cliente_nome
                    }
                });
                return cobranca;
            });

            return { status: 201, data: transaction };
        } catch (error: any) {
            console.error("Erro ao gerar cobrança: ", error);
            if (error.message.includes("validation")) {
                throw new Error("validation: " + error.message);
            }
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao gerar cobrança: " + error.message);
        }
    }
}

export { GeraCobrancaService };