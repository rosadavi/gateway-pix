import { generateToken } from '../middlewares/jwt.js';
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


function createToken(dados: JwtPayload, ) {
    const token = generateToken({
        CNPJ_CPF_Empresa: dados.CNPJ_CPF_Empresa,
        Id_Empresa: dados.Id_Empresa
    });
    return token;
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

    async login(req: Request, res: Response) {
        try {
            const fetchUser = await prisma.empresa.findFirst({
                where: {
                    CNPJ_CPF_Empresa: req.body.cnpj_cpf,
                    Senha_Empresa: req.body.senha
                },
                select: {
                    Id_Empresa: true,
                    CNPJ_CPF_Empresa: true
                }
            });
	    
            if(fetchUser) {
	       const token = generateToken(createToken);
               return res.status(200).json(token);
            } else {
                return res.status(404).json({message: 'Credenciais Invalidas!'});
            }
        } catch(error) {
           return res.status(500).json({message: "Erro ao realizar login.", error: error});
        }
    }

}
