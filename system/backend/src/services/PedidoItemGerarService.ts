import prismaClient from "../prisma";
import dotenv from "dotenv";

import { throwError } from "../errors/ErrorMap";
import { AppError } from "../errors/AppError";

dotenv.config();

interface ItemPedido {
    descricao_item: String;
    quantidade: number;
}

interface PedidoItemGerarProps {
    telefone_empresa: String;
    telefone_cliente: String;
    nome_cliente: String;
    num_parcelas: number;
    itens_pedido: ItemPedido[];
}

const codigoErro = "CIG";

export class CobrancaItensGerarService {
    async execute({ telefone_empresa, telefone_cliente, nome_cliente, num_parcelas, itens_pedido }: PedidoItemGerarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    telefoneEmpresa: telefone_empresa
                }
            });

            if(!empresa) throwError("not_found:empresa", codigoErro);

            const cliente = await prismaClient.pessoa.findUnique({
                where: {
                    telefone: telefone_cliente
                }
            });

            let cliente_id_cliente;
            let cliente_nome;

            if (!cliente) {
                const novoCliente = await prismaClient.pessoa.create({
                    data: {
                        telefone: telefone_cliente,
                        nomeCompleto: nome_cliente || String(process.env.GTW_NOME_CLIENTE_DEFAULT),
                        dataRegistro: new Date()
                    }
                });
                cliente_id_cliente = novoCliente.idPessoa;
               cliente_nome = novoCliente.nomeCompleto;
            } else {
                cliente_id_cliente = cliente.idPessoa;
                cliente_nome = cliente.nomeCompleto;
            }

            const total = async () => {
                let total = 0;
                for(let item of itens_pedido) {
                    const produto_item = await prismaClient.produto_item.findFirst({
                        where : {
                            descricao_item: item.descricao_item
                        }
                    });
    
                    if(!produto_item) throwError("not_found:item_produto", codigoErro);
    
                    const produto = await prismaClient.produto.findUnique({
                        where: {
                            idProduto: produto_item.produto_idProduto
                        }
                    });
    
                    if(!produto) throwError("not_found:produto", codigoErro);
    
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
                        pessoa_idPessoa_registrou: Number(process.env.GTW_ID_PESSOA_REGISTROU_COB),
                        cliente_nome
                    }
                });

                const item_pedido = [];

                for(let item of itens_pedido) {
                    let produto_item = await prismaClient.produto_item.findFirst({
                        where: {
                            descricao_item: item.descricao_item
                        }
                    });

                    if(!produto_item) throwError("not_found:item_produto", codigoErro);

                    const itens = await prisma.item_pedido.create({
                        data: {
                            pedido_idPedido: pedido.idPedido,
                            produto_item_idProdutoItem: produto_item.idProdutoItem,
                            quantidade: item.quantidade,
                            valor_item: produto_item.valor_item
                        }
                    });

                    item_pedido.push(itens);
                }

                return {
                    pedido,
                    item_pedido
                };
            });

            return { status: 201, pedido: transaction };
        } catch (error: any) {
            console.error("Erro ao gerar cobrança: ", error);
            if(error instanceof AppError) throw error;
            return { 
                status: 500, 
                error: "Erro ao gerar cobrança" + error.message 
            };
        }
    }
}
