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
            const fetchUser = await prismaClient.vw_empresa.findFirst({
                where: {
                    cpf_cnpj_empresa: cnpj_cpf,
                },
                select: {
                    id_empresa: true,
                    cpf_cnpj_empresa: true,
                    senha_empresa: true
                }
            });
            if(fetchUser) {
                const senhaValida = await compareHashSenha(senha, fetchUser.senha_empresa!);

                if(senhaValida) {
                    const token = createToken({
                        cpf_cnpj_empresa: fetchUser.cpf_cnpj_empresa ?? '',
                        id_empresa: fetchUser.id_empresa ??''
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