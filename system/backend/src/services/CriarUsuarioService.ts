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
            const senhaHash = await hashSenha(senha);

            const transaction = await prismaClient.$transaction(async () => {
            await prismaClient.pessoa.create({
                data: {
                  nomeCompleto: nome,
                  CPF_CNPJ: cpf_cnpj,
                  telefone,
                  email,
                  senha: senhaHash, // Lembre-se de hashificar a senha antes, se necessário
                  dataRegistro: new Date()
                },
            });

            // Preenchendo os valores padrão para os campos obrigatórios
            const novoUsuario = await prismaClient.empresa.create({
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
        } catch (error) {
            console.error("Erro ao criar usuario:", error);
            return { status: 500, message: "Erro ao criar usuário", error: (error as any).message};
        }
    }
}

export { CriarUsuarioProps };
