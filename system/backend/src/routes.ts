import express, { Router, Request, Response } from 'express';
import path from 'path';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController.js';
import { CriarUsuarioController } from './controllers/CriarUsuarioController.js';
import { GeraCobrancaController } from './controllers/GeraCobrancaController.js';
import {LoginController} from './controllers/LoginController.js';
import { GeraExtratoController } from './controllers/GeraExtratoController.js';
import { authMiddleware } from './middlewares/authJWT.js';

const app = express();

const __filename = path.join(process.cwd(), 'src', 'routes.ts');
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from the main route!');
});

router.get('/register', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/public/register.html'));
});

router.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/public/login.html'));
});

router.get('/index', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/public/index.html'));
});

router.get('/extract', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/public/extract.html'));
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
