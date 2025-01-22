import prismaClient from "../prisma";

interface CriarProdutoProps {
    Categoria_idCategoria: number;
    Empresa_idEmpresa: number;
    nomeProduto: string;
    valor: number;
    tipoProduto: string;
    valor_perc_equivalente_pontos?: number;
    valor_perc_equivalente_cashback?: number;
    ativo?: number;
    pontuaFidelidade?: number;
    pontuaCashback?: number;
    premioQtdProduto?: number;
    premioQtdValor?: number;
    expira_pontos_qtd_dias?: number;
    expira_cashback_qtd_dias?: number;
}

export class RegistrarProdutoService {
    async execute(data: CriarProdutoProps) {
        const {
            Categoria_idCategoria,
            Empresa_idEmpresa,
            nomeProduto,
            valor,
            tipoProduto,
            valor_perc_equivalente_pontos = 1.0,
            valor_perc_equivalente_cashback = 0.0,
            ativo = 1,
            pontuaFidelidade = 1,
            pontuaCashback = 1,
            premioQtdProduto = 0,
            premioQtdValor = 0.0,
            expira_pontos_qtd_dias,
            expira_cashback_qtd_dias
        } = data;

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

            // Cria o produto no banco
            const novoProduto = await prismaClient.produto.create({
                data: {
                    Categoria_idCategoria,
                    Empresa_idEmpresa,
                    nomeProduto,
                    valor,
                    tipoProduto,
                    valor_perc_equivalente_pontos,
                    valor_perc_equivalente_cashback,
                    ativo,
                    pontuaFidelidade,
                    pontuaCashback,
                    premioQtdProduto,
                    premioQtdValor,
                    expira_pontos_qtd_dias,
                    expira_cashback_qtd_dias,
                },
            });

            return novoProduto;
        } catch (error) {
            console.error("Erro ao registrar produto:", error);
            throw new Error("Erro ao registrar produto");
        }
    }
}
