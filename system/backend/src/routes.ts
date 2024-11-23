import { Router, Request, Response } from 'express';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController.js';
import { CriarUsuarioController } from './controllers/CriarUsuarioController.js';
import { GeraCobrancaController } from './controllers/GeraCobrancaController.js';
import {LoginController} from './controllers/LoginController.js';
import { GeraExtratoController } from './controllers/GeraExtratoController.js';
import { authMiddleware } from './middlewares/authJWT.js';

const router = Router();

router.get('/register', (req: Request, res: Response) => {
  res.render('register.handlebars');
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login.handlebars');
});

router.get('/', (req: Request, res: Response) => {
  res.render('index.handlebars', {empresa: 'Nome Empresa!'});
});

router.get('/extract', (req: Request, res: Response) => {

  res.render('extract.handlebars');
});

router.post('/verifica', (req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/criar', (req: Request, res: Response) => {
  new CriarUsuarioController().handle(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  new LoginController().handle(req, res);
});

router.post('/cobranca', authMiddleware,(req: Request, res: Response) => {
  new GeraCobrancaController().handle(req, res);
});

router.get('/validar', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Autorizado"});

});

router.post('/extrato', authMiddleware, (req: Request, res: Response) => {
  new GeraExtratoController().handle(req, res);
});

export default router;
