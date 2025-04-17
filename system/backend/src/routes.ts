import { Router, Request, Response } from 'express';

import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController';
import { CriarProprietarioController } from './controllers/CriarProprietarioController';
import { GeraCobrancaController } from './controllers/GeraCobrancaController';
import {LoginProprietarioController} from './controllers/LoginProprietarioController';
import { GeraExtratoController } from './controllers/GeraExtratoController';
import { CriarExtratoDetalhadoController } from './controllers/CriarExtratoDetalhadoController';
import { RegistrarProdutoController } from './controllers/RegistrarProdutoController';
import { CriarTipoTransacaoController } from './controllers/CriarTipoTransacaoController'
import { CriarItemProdutoController } from './controllers/CriarItemProdutoController'
import { CriarCategoriaController } from './controllers/CriarCategoriaController';
import { authMiddleware } from './middlewares/authJWT';
import { CriarCobrancaItensController } from './controllers/CriarCobrancaItensController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send("api rodando!");
});

router.post('/verifica', authMiddleware, (req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/empresa/cadastrar', (req: Request, res: Response) => {
  new CriarProprietarioController().handle(req, res);
});

router.post('/empresa/cadastrar', (req: Request, res: Response) => {
  new LoginProprietarioController().handle(req, res);
});

router.post('/cobranca/gerar', authMiddleware,(req: Request, res: Response) => {
  new GeraCobrancaController().handle(req, res);
});

router.post('/cobranca/gerar/itens', authMiddleware, (req: Request, res: Response) => {
  new CriarCobrancaItensController().handle(req, res);
});

router.get('/validar', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Autorizado"});
});

router.post('/extrato/gerar', authMiddleware, (req: Request, res: Response) => {
  new GeraExtratoController().handle(req, res);
});

router.post('/extrato/gerar/detalhado', authMiddleware, (req: Request, res: Response) => {
  new CriarExtratoDetalhadoController().handle(req, res);
});

router.post('/produto/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new RegistrarProdutoController().handle(req, res);
});

router.post('/produto/cadastrar/item', authMiddleware, (req: Request, res: Response) => {
  new CriarItemProdutoController().handle(req, res);
});

router.post('/produto/cadastrar/categoria', authMiddleware, (req: Request, res: Response) => {
  new CriarCategoriaController().handle(req, res);
});

router.post('/transacao/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new CriarTipoTransacaoController().handle(req, res);
});

export default router;
