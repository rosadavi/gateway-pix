import prismaClient from "../prisma";

interface GeraCobrancaUnicaProps {
    empresa_id_empresa: number;
    pedido_id_pedido: number;
    telefone_cliente: string;
    metodo_pagamento: string;
    valor_cobranca: number;
    status_cobranca: string;
    descricao_cobranca: string;
    num_parcela: number;
}

class GeraCobrancaUnicaService {
    async execute({ empresa_id_empresa, pedido_id_pedido, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela }: GeraCobrancaUnicaProps) {
        const cliente = await prismaClient.vw_cliente.findFirst({
            where: {
                telefone_cliente
            }
        });

        let cliente_id_cliente = null;

        if (!cliente) {
            const novoCliente = await prismaClient.vw_cliente.create({
                data: {
                    telefone_cliente
                }
            });

            cliente_id_cliente = novoCliente.id_cliente;
        } else {
            cliente_id_cliente = cliente.id_cliente;
        }
        const cobranca = await prismaClient.vw_cobranca.create({
            data: {
                empresa_id_empresa,
                pedido_id_pedido,
                cliente_id_cliente,
                metodo_pagamento,
                valor_cobranca,
                status_cobranca,
                descricao_cobranca,
                num_parcela
            }
        });

        return cobranca;
    }
}

export { GeraCobrancaUnicaService };