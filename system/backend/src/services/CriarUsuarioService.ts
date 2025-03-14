import { hashSenha } from "../configs/bcrypt";
import prismaClient from "../prisma";

interface CriarUsuarioProps {
    nome: string;
    telefone: string;
    email: string;
    estado: string;
    cidade: string;
    tipo_pix: string;
    chave_pix: string;
    senha: string;
    cpf_cnpj: string;
}

export class CriarUsuarioService {
    async execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj }: CriarUsuarioProps) {
        try {
            const usuarioExistente = await prismaClient.empresa.findUnique({
                where: { telefoneEmpresa: telefone },
            });

            if (usuarioExistente) {
                throw new Error("duplicate: Usuário já existe");
            }

            const senhaHash = await hashSenha(senha);

            const transaction = await prismaClient.$transaction(async (prisma) => {
                await prisma.pessoa.create({
                    data: {
                        nomeCompleto: nome,
                        CPF_CNPJ: cpf_cnpj,
                        telefone,
                        email,
                        senha: senhaHash,
                        dataRegistro: new Date()
                    },
                });

                const novoUsuario = await prisma.empresa.create({
                    data: {
                        nomeFantasia: nome,
                        telefoneEmpresa: telefone,
                        email: email,
                        uf: estado,
                        cidade: cidade,
                        pixType: tipo_pix,
                        pixKey: chave_pix,
                        senha: senhaHash,
                        empCpfCnpj: cpf_cnpj
                    }
                });
                return novoUsuario;
            });

            console.log("Usuario criado com sucesso:", transaction);
            return { status: 201, data: transaction };
        } catch (error: any) {
            console.error("Erro ao criar usuario:", error);
            if (error.message.includes("duplicate")) {
                throw new Error("duplicate: Usuário já existe");
            }
            throw new Error("Erro ao criar usuário: " + error.message);
        }
    }
}

export { CriarUsuarioProps };