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
            if(fetchUser) {
                const senhaValida = await compareHashSenha(senha, fetchUser.senha!);

                if(senhaValida) {
                    const token = createToken({
                        cpf_cnpj_empresa: fetchUser.empCpfCnpj ?? '',
                        id_empresa: fetchUser.idEmpresa ??''
                    });
                    return token;
                } else {
                    return  'Credenciais Invalidas!';
                    
                }
            } else {
                return 'Credenciais Invalidas!';
            }

        } catch(error) {
            console.error("Erro ao realizar login: ", error);
        }
    }
}