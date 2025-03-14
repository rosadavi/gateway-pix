import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const salt = 10;

export async function hashPayload(json: JwtPayload ): Promise <object> {
    try {
        const cpf_cnpj = json.cpf_cnpj_empresa;
        const id = json.id_empresa;
        
        const hash_cpf_cnpj = await bcrypt.hash(cpf_cnpj.toString(), salt);
        const hash_id = await bcrypt.hash(id.toString(), salt);

        const hash = { hash_cpf_cnpj, hash_id };
        console.log(hash);
        return hash;
    } catch (error) {
        console.error("Erro ao gerar o Hash do payload:", error);
        throw new Error("Erro ao gerar o Hash do payload!");
    }
}

export async function hashSenha(senha: string): Promise <string> {
    try {
        return await bcrypt.hash(senha, salt);
    } catch (error) {
        console.error("Erro ao gerar o Hash da senha:", error);
        throw new Error("Erro ao gerar o Hash da senha!");
    }
}

export async function compareHashSenha(senha: string, senhaHash: string): Promise <boolean> {
    try {
        return await bcrypt.compare(senha, senhaHash);
    } catch (error) {
        console.error("Erro ao comparar o Hash da senha:", error);
        throw new Error("Erro ao comparar o Hash da senha!");
    }
}