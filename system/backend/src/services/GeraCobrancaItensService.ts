import { compareHashSenha } from "../configs/bcrypt";
import prismaClient from "../prisma";

interface ItemPedido {
    produto_item_idProdutoItem: number;
    quantidade: number;
}

interface GeraCobrancaProps {
    empresa_id_empresa: number;
    telefone_cliente: string;
    metodo_pagamento: string;
    status_cobranca: string;
    descricao_cobranca: string;
    num_parcela: number;
    num_parcelas: number;
    itens_pedido: ItemPedido[];
    id_empresa: string;
}

class GeraCobrancaItensService {
    async execute({ empresa_id_empresa, telefone_cliente, metodo_pagamento, status_cobranca, descricao_cobranca, num_parcela, num_parcelas, itens_pedido, id_empresa }: GeraCobrancaProps) {
        try {
            const compare_id = await compareHashSenha(empresa_id_empresa.toString(), id_empresa);
            
            if (!compare_id) {
                throw new Error("validation: Id inválido");
            }

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

            const getItemValor = async (produto_item_idProdutoItem: number): Promise<number> => {
                const produtoItem = await prismaClient.produto_item.findUnique({
                    where: { idProdutoItem: produto_item_idProdutoItem },
                    select: { valor_item: true }
                });
                if (!produtoItem) {
                    throw new Error(`not found: Item com ID ${produto_item_idProdutoItem} não encontrado`);
                }
                return produtoItem.valor_item.toNumber();
            };

            const valorTotal = await itens_pedido.reduce(async (totalPromise: Promise<number>, item: ItemPedido) => {
                const total = await totalPromise;
                const valorItem = await getItemValor(item.produto_item_idProdutoItem);
                return total + (valorItem * item.quantidade);
            }, Promise.resolve(0));

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const pedido = await prisma.pedido.create({
                    data: {
                        empresa_idEmpresa: empresa_id_empresa,
                        pessoa_idPessoa_cliente: cliente_id_cliente,
                        status: 'P',
                        valorTotal: valorTotal,
                        totalParcelas: num_parcelas,
                        pessoa_idPessoa_registrou: 2
                    }
                });

                const pedido_idPedido = pedido.idPedido;

                await prisma.item_pedido.createMany({
                    data: await Promise.all(itens_pedido.map(async (item: ItemPedido) => ({
                        pedido_idPedido,
                        produto_item_idProdutoItem: item.produto_item_idProdutoItem,
                        quantidade: item.quantidade,
                        valor_item: await getItemValor(item.produto_item_idProdutoItem)
                    })))
                });

                const cobranca = await prisma.pagamento.create({
                    data: {
                        pedido_idPedido,
                        pag_tipo: metodo_pagamento,
                        pag_method: metodo_pagamento,
                        pag_valor: valorTotal,
                        pag_descricao: descricao_cobranca,
                        pag_status: status_cobranca,
                        parcela_numero: num_parcela,
                        cliente_telefone: telefone_cliente
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

export { GeraCobrancaItensService };