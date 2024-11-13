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
            
            const novoUsuario = await prismaClient.vw_empresa.create({
                data: {
                    nome_empresa: nome,
                    celular_empresa: telefone,
                    email_empresa: email,
                    uf_empresa: estado,
                    cidade_empresa: cidade,
                    tipo_pix_empresa: tipo_pix,
                    chave_pix_empresa: chave_pix,
                    senha_empresa: senhaHash,
                    cpf_cnpj_empresa: cpf_cnpj
                }
            });
            console.log("usuario criado", novoUsuario);
            return novoUsuario;
        } catch(error) {
            console.error("Erro ao criar usuario: ", error);
        }
    }
}