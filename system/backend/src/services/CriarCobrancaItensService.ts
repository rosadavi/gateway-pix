import prismaClient from "../prisma";
import dotenv from "dotenv";

dotenv.config();

interface ItemPedido {
    descricao_item: string;
    quantidade: number;
}

interface CriarCobrancaProps {
    telefone_empresa: string;
    telefone_cliente: string;
    nome_cliente: string;
    metodo_pagamento: string;
    descricao_cobranca: string;
    num_parcela: number;
    num_parcelas: number;
    itens_pedido: ItemPedido[];
}

export class CriarCobrancaItensService {
    async execute({ telefone_empresa, telefone_cliente, nome_cliente, metodo_pagamento, descricao_cobranca, num_parcela, num_parcelas, itens_pedido }: CriarCobrancaProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    telefoneEmpresa: telefone_empresa
                }
            });

            if(!empresa) throw new Error("not_found: Empresa nao cadastrada");

            const cliente = await prismaClient.pessoa.findUnique({
                where: {
                    telefone: telefone_cliente
                }
            });

            let cliente_id_cliente;

            if (!cliente) {
                const novoCliente = await prismaClient.pessoa.create({
                    data: {
                        telefone: telefone_cliente,
                        nomeCompleto: nome_cliente || String(process.env.GTW_NOME_CLIENTE_DEFAULT),
                        dataRegistro: new Date()
                    }
                });
                cliente_id_cliente = novoCliente.idPessoa;
            } else {
                cliente_id_cliente = cliente.idPessoa;
            }

            const total = async () => {
                let total = 0;
                for(let item of itens_pedido) {
                    const produto_item = await prismaClient.produto_item.findFirst({
                        where : {
                            descricao_item: item.descricao_item
                        }
                    });
    
                    if(!produto_item) throw new Error("not_found: Item de produto nao cadastrado");
    
                    const produto = await prismaClient.produto.findUnique({
                        where: {
                            idProduto: produto_item.produto_idProduto
                        }
                    });
    
                    if(!produto) throw new Error("not_found: Produto nao cadastrado");
    
                    let valorItemTotal = Number(produto_item.valor_item) * item.quantidade;
                    
                    total += valorItemTotal + Number(produto.valor);
                }
                return total;
            }

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const pedido = await prisma.pedido.create({
                    data: {
                        empresa_idEmpresa: empresa.idEmpresa,
                        pessoa_idPessoa_cliente: cliente_id_cliente,
                        status:  String(process.env.GTW_STATUS_PEDIDO_CREATE),
                        valorTotal: await total(),
                        totalParcelas: num_parcelas,
                        pessoa_idPessoa_registrou: Number(process.env.GTW_ID_PESSOA_REGISTROU_COB)
                    }
                });

                for(let item of itens_pedido) {
                    let produto_item = await prismaClient.produto_item.findFirst({
                        where: {
                            descricao_item: item.descricao_item
                        }
                    });

                    if(!produto_item) throw new Error("not_found: Item do produto nao cadastrado");

                    await prisma.item_pedido.create({
                        data: {
                            pedido_idPedido: pedido.idPedido,
                            produto_item_idProdutoItem: produto_item.idProdutoItem,
                            quantidade: item.quantidade,
                            valor_item: produto_item.valor_item
                        }
                    });
                }

                const cobranca = await prisma.pagamento.create({
                    data: {
                        pedido_idPedido: pedido.idPedido,
                        pag_tipo: metodo_pagamento,
                        pag_method: metodo_pagamento,
                        pag_valor: await total(),
                        pag_descricao: descricao_cobranca,
                        pag_status: "P",
                        parcela_numero: num_parcela,
                        cliente_telefone: telefone_cliente,
                        cliente_nome: nome_cliente
                    }
                });

                return cobranca;
            });

            return { status: 201, data: transaction };
        } catch (error: any) {
            console.error("Erro ao gerar cobrança: ", error);
            if(error.message.includes("not_found")) return { status: 404, message: error.message }
            return { status: 500, message: "Erro ao gerar cobrança", error: (error as any).message };
        }
    }
}