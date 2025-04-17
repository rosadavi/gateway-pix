import { hashSenha } from "../configs/bcrypt";
import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import prismaClient from "../prisma";

interface EmpresaCadastrarProps {
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

export class EmpresaCadastrarService {
    async execute({ nome, telefone, email, estado, cidade, tipo_pix, chave_pix, senha, cpf_cnpj }: EmpresaCadastrarProps) {
        try {
            const empresa = await prismaClient.empresa.findUnique({
                where: { telefoneEmpresa: telefone },
            });

            if(empresa) throwError("duplicate:empresa");

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
        } catch (error : any) {
            console.error("Erro ao criar Proprietario:", error);
            if(error instanceof AppError) throw error;
            return { 
                status: 500, 
                error: "Erro ao criar usuário" + error.message
            };
        }
    }
}