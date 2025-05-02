import prismaClient from "../prisma";
import { generateToken } from '../middlewares/jwt.js';
import { JwtPayload } from "../configs/token";
import { compareHashSenha } from "../configs/bcrypt";
import { AppError } from "../errors/AppError";
import { throwError } from "../errors/ErrorMap";
import { validarTelefone } from "../configs/validarTelefone";

interface EmpresaLoginProps {
    telefone: string;
    senha: string;
}

function createToken(dados: JwtPayload) {
    const token = generateToken({
        cpf_cnpj_empresa: dados.cpf_cnpj_empresa,
        id_empresa: dados.id_empresa
    });
    return token;
}

const codigoErro = "ELS";

export class EmpresaLoginService {
    async execute({ telefone, senha }: EmpresaLoginProps) {
        try {
            const numeroValidado = validarTelefone(telefone);
            if(!numeroValidado) throwError("invalid:number");
            const proprietarioExistente = await prismaClient.empresa.findUnique({
                where: {
                    telefoneEmpresa: telefone,
                },
                select: {
                    idEmpresa: true,
                    empCpfCnpj: true,
                    senha: true
                }
            });

            if (proprietarioExistente) {
                const senhaValida = await compareHashSenha(senha, proprietarioExistente.senha!);

                if (senhaValida) {
                    const token = await createToken({
                        cpf_cnpj_empresa: proprietarioExistente.empCpfCnpj ?? '',
                        id_empresa: proprietarioExistente.idEmpresa ?? ''
                    });
                    
                    return { status: 200, message: {
                        token,
                        id: proprietarioExistente.idEmpresa
                    } };
                } else {
                    throwError("invalid:login", codigoErro);
                }
            } else {
                throwError("invalid:login", codigoErro);
            }
        } catch (error: any) {
            console.error("Erro ao realizar login: ", error);
            if(error instanceof AppError) throw error;
            return {
                status: 500,
                error: "Erro ao realizar login: " + error.message
            }
        }
    }
}