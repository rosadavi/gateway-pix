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
        } catch (error: any) {
            console.error("Erro ao criar categoria:", error);
            if (error.message.includes("duplicate")) {
                throw new Error("duplicate: Categoria já existe");
            }
            throw new Error("Erro ao criar categoria: " + error.message);
        }
    }
}
