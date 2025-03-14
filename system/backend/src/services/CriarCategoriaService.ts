import prismaClient from "../prisma";

interface CriarCategoriaProps {
    nomeCategoria: string;
}

export class CriarCategoriaService {
    async execute({ nomeCategoria }: CriarCategoriaProps) {
        try {

            const novaCategoria = await prismaClient.categoria.create({
                data: {
                  nomeCategoria
                },
            });
            console.log("Categoria criada com sucesso:", novaCategoria);
            return {status: 201, data: novaCategoria};
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            return { status: 500, message: "Erro ao criar categoria", error: (error as any).message};
        }
    }
}

export { CriarCategoriaProps };
