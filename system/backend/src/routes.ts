import { Router, Request, Response } from 'express';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController.js';
import { CriarProprietarioController } from './controllers/CriarProprietarioController.js';
import { GeraCobrancaController } from './controllers/GeraCobrancaController.js';
import {LoginController} from './controllers/LoginController.js';
import { GeraExtratoController } from './controllers/GeraExtratoController.js';
import { GeraExtratoGeralController } from './controllers/GeraExtratoGeralController.js';
import { RegistrarProdutoController } from './controllers/RegistrarProdutoController.js';
import { CriarTipoTransacaoController } from './controllers/CriarTipoTransacaoController.js'
import { CriarItemProdutoController } from './controllers/CriarItemProdutoController.js'

import { CriarCategoriaController } from './controllers/CriarCategoriaController.js';

import { authMiddleware } from './middlewares/authJWT.js';
import { GeraCobrancaItensController } from './controllers/GeraCobrancaItensController.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send("api rodando!");
});

router.post('/verifica', authMiddleware, (req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/criar/proprietario', (req: Request, res: Response) => {
  new CriarProprietarioController().handle(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  new LoginController().handle(req, res);
});

router.post('/cobranca', authMiddleware,(req: Request, res: Response) => {
  new GeraCobrancaController().handle(req, res);
});

router.post('/cobranca/itens', authMiddleware, (req: Request, res: Response) => {
  new GeraCobrancaItensController().handle(req, res);
});

router.get('/validar', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Autorizado"});
});

router.post('/extrato', authMiddleware, (req: Request, res: Response) => {
  new GeraExtratoController().handle(req, res);
});

router.post('/extrato/detalhado', authMiddleware, (req: Request, res: Response) => {
  new GeraExtratoGeralController().handle(req, res);
});

router.post('/produto/registrar', authMiddleware, (req: Request, res: Response) => {
  new RegistrarProdutoController().handle(req, res);
});

router.post('/produto/item/registrar', authMiddleware, (req: Request, res: Response) => {
  new CriarItemProdutoController().handle(req, res);
});

router.post('/produto/categoria', authMiddleware, (req: Request, res: Response) => {
  new CriarCategoriaController().handle(req, res);
});

router.post('/transacao/criar', authMiddleware, (req: Request, res: Response) => {
  new CriarTipoTransacaoController().handle(req, res);
});

export default router;
