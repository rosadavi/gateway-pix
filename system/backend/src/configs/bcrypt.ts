import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const salt = 10;

export async function hashPayload(texto: JwtPayload ): Promise <string> {
    try {
        const string = JSON.stringify(texto);
        const hash = await bcrypt.hash(string, salt);
        return hash;
    } catch(erro) {
        throw new Error("Erro ao gerar o Hash!");
    }
}

export async function hashSenha(senha: string): Promise <string> {
    try {
        return await bcrypt.hash(senha, salt);
    } catch(erro) {
        throw new Error("Erro ao gerar o Hash!");
    }
}

export async function compareHashSenha(senha: string, senhaHash: string): Promise <boolean> {
    return await bcrypt.compare(senha, senhaHash);
}