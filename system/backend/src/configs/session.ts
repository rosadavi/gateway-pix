import { Request } from 'express';

export async function saveSession(req: Request, id: number, token: string) {
    const loginData = {
        userId: id,
        token,
        isAuthenticated: true,
    };

    if (!req.session.loginHistory) {
        req.session.loginHistory = [];
    }

    req.session.loginHistory.push(loginData);

    req.session.save((err: any) => {
        if (err) console.error('Erro ao salvar a sessão:', err);
    });
}

export async function getUserIdFromToken(req: Request): Promise<number> {
    if (!req.session?.loginHistory) {
        throw new Error("Sessão não encontrada.");
    }

    const conteudo = req.session.loginHistory.find((item: any) => item.token === req.body.token);
    
    if (!conteudo) {
        throw new Error("Token não encontrado na sessão.");
    }

    return conteudo.userId;
}
