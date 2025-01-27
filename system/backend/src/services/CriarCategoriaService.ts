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

            console.log("Usuario criado com sucesso:", novaCategoria);
            return novaCategoria;
        } catch (error) {
            console.error("Erro ao criar usuario:", error);
            throw new Error('Erro ao criar usuário');
        }
    }
}

export { CriarCategoriaProps };
