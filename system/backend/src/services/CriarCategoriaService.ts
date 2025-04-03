import prismaClient from "../prisma";

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

            if(categoriaExistente) return {status: 409, message: "Categoria ja cadastrada."}

            const novaCategoria = await prismaClient.categoria.create({
                data: {
                  nomeCategoria
                }
            });

            return { status: 201, data: novaCategoria };
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            return { status: 500, message: "Erro ao criar categoria", error: (error as any).message};
        }
    }
}