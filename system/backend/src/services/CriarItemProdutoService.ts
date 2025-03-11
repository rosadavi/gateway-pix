import { JwtPayload } from "../configs/token";
import { compareHashSenha } from "../configs/bcrypt"
import prismaClient from "../prisma";

interface CriarItemProdutoProps {
    cnpj_cpf: string,
    descricao_item: string,
    valor_item: number,
    item_ativo: number,
    cpf_cnpj_empresa: string,
    nomeProduto: string
}

export class CriarItemProdutoService {
    async execute({ cnpj_cpf, descricao_item, valor_item, item_ativo, nomeProduto, cpf_cnpj_empresa }: CriarItemProdutoProps) {
        try {
            const cnpj_cpfValido = compareHashSenha(cnpj_cpf, cpf_cnpj_empresa);

            if(!cnpj_cpfValido) {
                return { status: 500, message: "CNPJ ou CPF invalido"}
            }

            const idEmpresaObj = await prismaClient.empresa.findFirst({
                where: {
                    empCpfCnpj: cnpj_cpf
                },
                select: {
                    idEmpresa: true
                }
            });

            const idEmpresa = idEmpresaObj?.idEmpresa;

            const idProdutoObj = await prismaClient.produto.findFirst({
                where: {
                    Empresa_idEmpresa: idEmpresa,
                    nomeProduto: nomeProduto
                },
                select: {
                    idProduto: true
                }
            });

            if(!idProdutoObj) {
                return { status: 500, message: "Produto nao encontrado"}
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
            return {status: 201, message: transaction}

        } catch (error) {
            console.error("Erro ao registrar item:", error);
            return { status: 500, message: "Erro ao registrar item", error: (error as any).message };
        }
    }
}