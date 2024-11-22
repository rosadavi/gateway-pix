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
        const cliente = await prismaClient.pessoa.findFirst({
            where: {
                telefone: telefone_cliente
            }
        });

        let cliente_id_cliente = null;

        if (!cliente) {
            const novoCliente = await prismaClient.pessoa.create({
                data: {
                    telefone: telefone_cliente,
                    dataRegistro: new Date()
                }
            });

            cliente_id_cliente = novoCliente.idPessoa;
        } else {
            cliente_id_cliente = cliente.idPessoa;
        }

        const pedido = await prismaClient.pedido.create({
            data: {
                empresa_idEmpresa: empresa_id_empresa,
                pessoa_idPessoa_cliente: cliente_id_cliente,
                status: 'P',
                valorTotal: valor_cobranca,
                totalParcelas: num_parcelas,
                pessoa_idPessoa_registrou: 2
            }
        });
        const pedido_idPedido = pedido.idPedido;

        const cobranca = await prismaClient.pagamento.create({
            data: {
                pedido_idPedido,
                pag_tipo: metodo_pagamento, 
                pag_method: metodo_pagamento,
                pag_valor: valor_cobranca,
                pag_descricao: descricao_cobranca,
                pag_status: status_cobranca,
                parcela_numero: num_parcela,
                cliente_telefone: telefone_cliente
            }
        });

        return cobranca;
    }
}

export { GeraCobrancaService };