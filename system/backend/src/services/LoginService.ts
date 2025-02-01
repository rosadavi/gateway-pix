import prismaClient from "../prisma";
import { generateToken } from '../middlewares/jwt.js';
import { JwtPayload } from "../configs/token";
import { compareHashSenha } from "../configs/bcrypt";


interface LoginProps {
    cnpj_cpf: string;
    senha: string;
}

function createToken(dados: JwtPayload, ) {
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

            if (fetchUser) {
                const senhaValida = await compareHashSenha(senha, fetchUser.senha!);

                if (senhaValida) {
                    const token = await createToken({
                        cpf_cnpj_empresa: fetchUser.empCpfCnpj ?? '',
                        id_empresa: fetchUser.idEmpresa ?? ''
                    });
                    return { status: 200, token: token };
                } else {
                    return { status: 401, message: 'Credenciais Inválidas!' };
                }
            } else {
                return { status: 401, message: 'Credenciais Inválidas!' };
            }
        } catch (error) {
            console.error("Erro ao realizar login: ", error);
            return { status: 500, message: "Erro ao realizar login", error: (error as any).message };
        }
    }
}