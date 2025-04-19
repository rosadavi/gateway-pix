import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";
import { PedidoItemGerarService } from "./PedidoItemGerarService";
import dotenv from 'dotenv';

dotenv.config();

interface ItemPedido {
    descricao_item: string;
    quantidade: number;
}

interface CobrancaItemGerarProps {
    telefoneEmpresa: String,
    pag_tipo: String,
    pag_method: String,
    pag_descricao: string,
    telefone_cliente: String, 
    nome_cliente: String,
    num_parcelas: number, 
    itens_pedido: ItemPedido[]
}

export class CobrancaItemGerarService {
    async execute({
        telefoneEmpresa,
        pag_tipo,
        pag_method,
        pag_descricao,
        telefone_cliente, 
        nome_cliente, 
        num_parcelas, 
        itens_pedido
    }: CobrancaItemGerarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: { telefoneEmpresa },
            });

            if(!empresa) throwError("not_found:empresa");

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

            const pedidoItemGerarService = new PedidoItemGerarService();
            const pedido = await pedidoItemGerarService.execute({
                telefone_empresa: telefoneEmpresa, 
                telefone_cliente: telefone_cliente,
                nome_cliente, 
                num_parcelas, 
                itens_pedido
            });

            if(pedido.status !== 201) throwError("internal_error:cobranca_pedido");

            const transaction = await prismaClient.$transaction(async(prisma) => {
                const cobranca = await prisma.pagamento.create({
                    data: {
                        pedido_idPedido: pedido.pedido.pedido .idPedido,
                        pag_tipo,
                        pag_method,
                        pag_valor: pedido.pedido.pedido.valorTotal,
                        pag_descricao,
                        pag_status: String(process.env.GTW_STATUS_PEDIDO_CREATE),
                        parcela_numero: 1,
                        cliente_telefone: telefone_cliente,
                        cliente_nome
                    }
                });

                return cobranca;
            });

            return {
                status: 201,
                cobranca: transaction,
                pedido
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