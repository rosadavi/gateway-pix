import prismaClient from "../prisma";
import { throwError } from "../errors/ErrorMap";
import { AppError } from "../errors/AppError";

interface CriarCategoriaProps {
    nomeCategoria: string;
}

export class CriarCategoriaService {
    async execute({ nomeCategoria }: CriarCategoriaProps) {
        try {
            const categoriaExistente = await prismaClient.categoria.findUnique({
                where: {
                    nomeCategoria
                }
            });

            if(categoriaExistente) throwError("duplicate:categoria")

            const novaCategoria = await prismaClient.categoria.create({
                data: {
                  nomeCategoria
                }
            });

            return { status: 201, data: novaCategoria };
        } catch (error: any) {
            console.error("Erro ao criar categoria:", error);
            if(error instanceof AppError) throw Error;
            return {
                status: 500,
                error: "Erro ao criar categoria: " + error.message
            };
        }
    }
}
