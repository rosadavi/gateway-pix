import prismaClient from "../prisma";
import { throwError } from "../errors/ErrorMap";
import { AppError } from "../errors/AppError";

interface ProdutoCategoriaCadastrarProps {
    nomeCategoria: string;
}

const codigoErro = "PCCS";

export class ProdutoCategoriaCadastrarService {
    async execute({ nomeCategoria }: ProdutoCategoriaCadastrarProps) {
        try {
            const categoriaExistente = await prismaClient.categoria.findUnique({
                where: {
                    nomeCategoria
                }
            });

            if(categoriaExistente) throwError("duplicate:categoria", codigoErro)

            const novaCategoria = await prismaClient.categoria.create({
                data: {
                  nomeCategoria
                }
            });

            return { status: 201, data: novaCategoria };
        } catch (error: any) {
            console.error("Erro ao criar categoria:", error);
            if(error instanceof AppError) throw error;
            return {
                status: 500,
                error: "Erro ao criar categoria: " + error.message
            };
        }
    }
}
