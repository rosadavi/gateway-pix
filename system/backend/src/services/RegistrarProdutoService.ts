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
            // Valida se a categoria existe
            const categoria = await prismaClient.categoria.findUnique({
                where: { idCategoria: Categoria_idCategoria },
            });

            if (!categoria) {
                throw new Error("Categoria não encontrada");
            }

            // Valida se a empresa existe
            const empresa = await prismaClient.empresa.findUnique({
                where: { idEmpresa: Empresa_idEmpresa },
            });

            if (!empresa) {
                throw new Error("Empresa não encontrada");
            }

            const transaction = await prismaClient.$transaction(async () => {
            // Cria o produto no banco
            const novoProduto = await prismaClient.produto.create({
                data: {
                    Categoria_idCategoria,
                    Empresa_idEmpresa,
                    nomeProduto,
                    valor,
                    tipoProduto,
                },
            });

            const valorItem = valor_item ?? valor;

            const novoProdutoItem = await prismaClient.produto_item.create( {
                data: {
                    produto_idProduto: novoProduto.idProduto, // Associando ao produto recém-criado
                    descricao_item,
                    valor_item: valorItem,
                    item_ativo: 1
                }
            })
            return { novoProduto, novoProdutoItem };
        });

            return {status: 201, data: {
                produto: transaction.novoProduto, 
                produtoItem: transaction.novoProdutoItem
            }};
        } catch (error) {
            console.error("Erro ao registrar produto:", error);
            return { status: 500, message: "Erro ao registrar produto", error: (error as any).message };
        }
    }
}
