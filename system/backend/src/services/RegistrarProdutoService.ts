import prismaClient from "../prisma";
import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";

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

            if (!categoria) throwError("not_found:categoria");

            const empresa = await prismaClient.empresa.findFirst({
                where: { 
                    empCpfCnpj: cpf_cnpj
                }
            });

            if (!empresa) throwError("not_found:empresa"); 

            const produto = await prismaClient.produto.findFirst({
                where: {
                    Categoria_idCategoria: categoria.idCategoria,
                    Empresa_idEmpresa: empresa.idEmpresa,
                    nomeProduto
                }
            });

            if(produto) throwError("duplicate:produto");

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
            if(error.instanceof(AppError)) throw Error;
            return { 
                status: 500, 
                error: "Erro ao registrar produto" + error.message
            };
        }
    }
}
