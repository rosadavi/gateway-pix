import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface EmpresaInterface {
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

export class UserController {
    async criar(dados: EmpresaInterface) {
        try {
            const novoUsuario = await prisma.empresa.create({
                data: {
                    Nome_Empresa: dados.nome,
                    Celular_Empresa: dados.telefone,
                    Email_Empresa: dados.email,
                    UF_Empresa: dados.estado,
                    Cidade_Empresa: dados.cidade,
                    Tipo_PIX_Empresa: dados.tipo_pix,
                    Chave_PIX_Empresa: dados.chave_pix,
                    Senha_Empresa: dados.senha,
                    CNPJ_CPF_Empresa: dados.cpf_cnpj
                }
            });
            console.log("usuario criado", novoUsuario);
            return novoUsuario;
        } catch(error) {
            console.error("Erro ao criar usuario: ", error);
        }
    }
}