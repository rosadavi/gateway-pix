import { Router, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController.js';
import { UserController } from './controllers/userController.js';

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
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/auth/register.html'));
});

router.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/auth/login.html'));
});

router.get('/about', (req: Request, res: Response) => {
  res.send('About page');
});

router.post('/verifica',(req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/criar', async (req: Request, res: Response) => {
  try {
    const createUser = await usuario.criar(req.body);
    res.send(createUser);
  } catch(error) {
    res.status(500).json({
      message: 'Erro ao criar usuario!',
      error: error,
    });
  }
});

export default router;