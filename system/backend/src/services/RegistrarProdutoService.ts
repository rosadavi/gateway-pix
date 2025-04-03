import prismaClient from "../prisma";

interface CriarProdutoProps {
    nomeCategoria: string;
    cpf_cnpj: string;
    nomeProduto: string;
    valor: number;
    tipoProduto: string;
}

export class RegistrarProdutoService {
    async execute({ nomeCategoria, cpf_cnpj, nomeProduto, valor, tipoProduto }: CriarProdutoProps) {
        try {
            const categoria = await prismaClient.categoria.findFirst({
                where: {
                    nomeCategoria
                }
            });

            if (!categoria) throw new Error("not_found: Categoria nao encontrada");

            const empresa = await prismaClient.empresa.findFirst({
                where: { 
                    empCpfCnpj: cpf_cnpj
                }
            });

            if (!empresa) throw new Error("not_found: Empresa nao encontrada"); 

            const produto = await prismaClient.produto.findFirst({
                where: {
                    Categoria_idCategoria: categoria.idCategoria,
                    Empresa_idEmpresa: empresa.idEmpresa,
                    nomeProduto
                }
            });

            if(produto) throw new Error("duplicate: Produto ja registrado");

            const transaction = await prismaClient.$transaction(async (prisma) => {
            const novoProduto = await prisma.produto.create({
                data: {
                    Categoria_idCategoria: categoria.idCategoria,
                    Empresa_idEmpresa: empresa.idEmpresa,
                    nomeProduto,
                    valor,
                    tipoProduto
                }
            });
            return { novoProduto };
        });

            return {status: 201, data: transaction};
        } catch (error: any) {
            console.error("Erro ao registrar produto:", error);
            if(error.message.includes("not_found")) return { status: 404, message: error.message}
            if(error.message.includes("duplicate")) return { status: 409, message: error.message}

            return { status: 500, message: "Erro ao registrar produto", error: (error as any).message };
        }
    }
}
