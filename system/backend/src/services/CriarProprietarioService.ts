import { hashSenha } from "../configs/bcrypt";
import prismaClient from "../prisma";

interface CriarProprietarioProps {
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

export class CriarProprietarioService {
    async execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj }: CriarProprietarioProps) {
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

            const novoProprietario = await prisma.empresa.create({
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
            return novoProprietario;
        });

            return { status: 201, data: transaction };
        } catch (error) {
            console.error("Erro ao criar Proprietario:", error);
            return { status: 500, message: "Erro ao criar usuário", error: (error as any).message};
        }
    }
}