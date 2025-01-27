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
            console.log("usuario criado", novoUsuario);
            return { status: 201, data: novoUsuario };
        } catch (error) {
            console.error("Erro ao criar usuario: ", error);
            return { status: 500, message: "Erro ao criar usuário", error: (error as any).message};
        }
    }
}

export { CriarUsuarioProps }