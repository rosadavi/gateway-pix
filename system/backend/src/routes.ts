import { Router, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController.js';
import { UserController } from './controllers/userController.js';
import { authMiddleware } from './middlewares/authJWT.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

const router = Router();

const usuario = new UserController();

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

router.post('/verifica',(req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/criar', async (req: Request, res: Response) => {
  try {
    const createUser = await usuario.criar(req.body);
    if(createUser) {
      res.redirect('/login');
    } else {
      res.status(500).json({message: "Erro ao criar usuario"});
    }
  } catch(error) {
    res.status(500).json({
      message: 'Erro ao criar usuario!',
      error,
    });
  }
});

router.get('/dados', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Dados de uma rota que precisa de autorizacao"});
});

router.post('/login', usuario.login);

export default router;