import prismaClient from "../prisma";
import { generateToken } from '../middlewares/jwt.js';
import { JwtPayload } from "../configs/token";
import { compareHashSenha } from "../configs/bcrypt";

interface LoginProps {
    cnpj_cpf: string;
    senha: string;
}

function createToken(dados: JwtPayload) {
    const token = generateToken({
        cpf_cnpj_empresa: dados.cpf_cnpj_empresa,
        id_empresa: dados.id_empresa
    });
    return token;
}

export class LoginService {
    async execute({ cnpj_cpf, senha }: LoginProps) {
        try {
            const fetchUser = await prismaClient.empresa.findFirst({
                where: {
                    empCpfCnpj: cnpj_cpf,
                },
                select: {
                    idEmpresa: true,
                    empCpfCnpj: true,
                    senha: true
                }
            });

            if (!fetchUser) {
                throw new Error("invalid credentials: Credenciais Inválidas!");
            }

            const senhaValida = await compareHashSenha(senha, fetchUser.senha!);

            if (!senhaValida) {
                throw new Error("invalid credentials: Credenciais Inválidas!");
            }

            const token = await createToken({
                cpf_cnpj_empresa: fetchUser.empCpfCnpj ?? '',
                id_empresa: fetchUser.idEmpresa ?? ''
            });

            return { status: 200, token: token };
        } catch (error: any) {
            console.error("Erro ao realizar login: ", error);
            if (error.message.includes("invalid credentials")) {
                throw new Error("invalid credentials: " + error.message);
            }
            throw new Error("Erro ao realizar login: " + error.message);
        }
    }
}