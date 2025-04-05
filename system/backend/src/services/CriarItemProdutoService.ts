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

            if(!empresa) throw new Error("not_found: Empresa nao cadastrada");

            const produto = await prismaClient.produto.findFirst({
                where: {
                    Empresa_idEmpresa: empresa.idEmpresa,
                    nomeProduto
                }
            });

            if(!produto) throw new Error("not_found: Produto nao cadastrado");

            const item = await prismaClient.produto_item.findFirst({
                where: {
                    descricao_item
                }
            });

            if(item) throw new Error("duplicate: Item ja cadastrado");
            
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
            if(error.message.includes("not_found")) return { status: 404, message: error.message }
            if(error.message.includes("duplicate")) return { status: 409, message: error.message }
            return { status: 500, message: "Erro ao registrar item", error: (error as any).message };
        }
    }
}