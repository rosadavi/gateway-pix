import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface CriarItemProdutoProps {
    cnpj_cpf: string,
    descricao_item: string,
    valor_item: number,
    item_ativo: number,
    nomeProduto: string
}

export class CriarItemProdutoService {
    async execute({ cnpj_cpf, descricao_item, valor_item, item_ativo, nomeProduto }: CriarItemProdutoProps) {
        try {
            const empresa = await prismaClient.empresa.findFirst({
                where: {
                    empCpfCnpj: cnpj_cpf
                }
            });

            if(!empresa) throwError("not_found:empresa");

            const produto = await prismaClient.produto.findFirst({
                where: {
                    Empresa_idEmpresa: empresa.idEmpresa,
                    nomeProduto
                }
            });

            if(!produto) throwError("not_found:produto");

            const item = await prismaClient.produto_item.findFirst({
                where: {
                    descricao_item
                }
            });

            if(item) throwError("duplicate:item");
            
            const transaction = await prismaClient.$transaction(async (prisma) => {
                const novoItem = await prisma.produto_item.create({
                    data: {
                        produto_idProduto: produto.idProduto,
                        descricao_item,
                        valor_item,
                        item_ativo
                    }
                });

                return novoItem;
            });

            return {
                status: 200,
                transaction
            }
        } catch (error: any) {
            console.error("Erro ao registrar item:", error);
            if(error instanceof AppError) throw error;
            return { 
                status: 500, 
                error: "Erro ao registrar item" + error.message 
            };
        }
    }
}