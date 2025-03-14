import { compareHashSenha } from "../configs/bcrypt";
import prismaClient from "../prisma";

interface CriarItemProdutoProps {
    cnpj_cpf: string;
    descricao_item: string;
    valor_item: number;
    item_ativo: number;
    cpf_cnpj_empresa: string;
    nomeProduto: string;
}

export class CriarItemProdutoService {
    async execute({ cnpj_cpf, descricao_item, valor_item, item_ativo, nomeProduto, cpf_cnpj_empresa }: CriarItemProdutoProps) {
        try {
            const cnpj_cpfValido = await compareHashSenha(cnpj_cpf, cpf_cnpj_empresa);

            if (!cnpj_cpfValido) {
                throw new Error("validation: CNPJ ou CPF inválido");
            }

            const idEmpresaObj = await prismaClient.empresa.findFirst({
                where: {
                    empCpfCnpj: cnpj_cpf
                },
                select: {
                    idEmpresa: true
                }
            });

            if (!idEmpresaObj) {
                throw new Error("not found: Empresa não encontrada");
            }

            const idEmpresa = idEmpresaObj.idEmpresa;

            const idProdutoObj = await prismaClient.produto.findFirst({
                where: {
                    Empresa_idEmpresa: idEmpresa,
                    nomeProduto: nomeProduto
                },
                select: {
                    idProduto: true
                }
            });

            if (!idProdutoObj) {
                throw new Error("not found: Produto não encontrado");
            }

            const idProduto = idProdutoObj.idProduto;

            const transaction = await prismaClient.$transaction(async (prisma) => {
                const novoItem = await prisma.produto_item.create({
                    data: {
                        produto_idProduto: idProduto,
                        descricao_item,
                        valor_item,
                        item_ativo,
                    },
                });

                return { novoItem };
            });

            return { status: 201, message: "Item registrado com sucesso", data: transaction };
        } catch (error: any) {
            console.error("Erro ao registrar item:", error);
            if (error.message.includes("validation")) {
                throw new Error("validation: " + error.message);
            }
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao registrar item: " + error.message);
        }
    }
}