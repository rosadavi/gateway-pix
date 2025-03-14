import prismaClient from "../prisma";

interface CriarProdutoProps {
    Categoria_idCategoria: number;
    Empresa_idEmpresa: number;
    nomeProduto: string;
    valor: number;
    tipoProduto: string;
    descricao_item: string;
    valor_item?: number;
}

export class RegistrarProdutoService {
    async execute({ Categoria_idCategoria, Empresa_idEmpresa, nomeProduto, valor, tipoProduto, descricao_item, valor_item }: CriarProdutoProps) {
        try {
            const categoria = await prismaClient.categoria.findUnique({
                where: { idCategoria: Categoria_idCategoria },
            });

            if (!categoria) {
                throw new Error("not found: Categoria não encontrada");
            }

            const empresa = await prismaClient.empresa.findUnique({
                where: { idEmpresa: Empresa_idEmpresa },
            });

            if (!empresa) {
                throw new Error("not found: Empresa não encontrada");
            }

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const novoProduto = await prisma.produto.create({
                    data: {
                        Categoria_idCategoria,
                        Empresa_idEmpresa,
                        nomeProduto,
                        valor,
                        tipoProduto,
                    },
                });

                const valorItem = valor_item ?? valor;

                const novoProdutoItem = await prisma.produto_item.create({
                    data: {
                        produto_idProduto: novoProduto.idProduto,
                        descricao_item,
                        valor_item: valorItem,
                        item_ativo: 1
                    }
                });
                return { novoProduto, novoProdutoItem };
            });

            return {
                status: 201,
                data: {
                    produto: transaction.novoProduto,
                    produtoItem: transaction.novoProdutoItem
                }
            };
        } catch (error: any) {
            console.error("Erro ao registrar produto:", error);
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao registrar produto: " + error.message);
        }
    }
}