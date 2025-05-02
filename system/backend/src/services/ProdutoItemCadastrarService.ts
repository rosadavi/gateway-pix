import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface ProdutoItemCadastrarProps {
    idEmpresa: number,
    descricao_item: string,
    valor_item: number,
    item_ativo: number,
    nomeProduto: string
}

const codigoErro = "PICS";

export class ProdutoItemCadastrarService {
    async execute({ idEmpresa, descricao_item, valor_item, item_ativo, nomeProduto }: ProdutoItemCadastrarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: {
                    idEmpresa
                }
            });

            if(!empresa) throwError("not_found:empresa", codigoErro);

            const produto = await prismaClient.produto.findFirst({
                where: {
                    Empresa_idEmpresa: idEmpresa,
                    nomeProduto
                }
            });

            if(!produto) throwError("not_found:produto", codigoErro);

            const item = await prismaClient.produto_item.findFirst({
                where: {
                    descricao_item
                }
            });

            if(item) throwError("duplicate:item", codigoErro);
            
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
