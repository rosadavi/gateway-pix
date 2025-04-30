import { Request } from 'express';

export async function saveSession(req: Request, id: number) {
    req.session.userId = id;
    req.session.isAuthenticated = true;


    req.session.save((err: any) => {
        if (err) {
            console.error('Erro ao salvar a sessão:', err);
        } else {
            console.log('Sessão salva com sucesso');
        }
    });
}