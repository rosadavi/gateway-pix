import prismaClient from "../prisma";

interface ItemPedido {
    pedido_idPedido: number;
    produto_item_idProdutoItem: number;
    quantidade: number;
    valor_item: number;
}

interface GeraCobrancaProps {
    empresa_id_empresa: number;
    telefone_cliente: string;
    metodo_pagamento: string;
    valor_cobranca: number;
    status_cobranca: string;
    descricao_cobranca: string;
    num_parcela: number;
    num_parcelas: number;
    itens_pedido: ItemPedido[];
}

class GeraCobrancaService {
    async execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, valor_cobranca, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido }: GeraCobrancaProps) {
       try{
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

        const transaction = await prismaClient.$transaction(async (prisma) => {
        const pedido = await prisma.pedido.create({
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

        await prisma.item_pedido.createMany({
            data: itens_pedido.map((item: ItemPedido)=> ({
                pedido_idPedido,
                produto_item_idProdutoItem: item.produto_item_idProdutoItem,
                quantidade: item.quantidade,
                valor_item: item.valor_item
            }))
        });

        const cobranca = await prisma.pagamento.create({
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
    });

        return { status: 201, data: transaction };
    } catch (error) {
        console.error("Erro ao gerar cobrança: ", error);
        return { status: 500, message: "Erro ao gerar cobrança", error: (error as any).message };
    }
}
}

export { GeraCobrancaService };