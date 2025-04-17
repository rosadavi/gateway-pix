import { Router, Request, Response } from 'express';

import { EmpresaCadastrarController } from './controllers/EmpresaCadastrarController';
import { EmpresaLoginController } from './controllers/EmpresaLoginController';
import { CobrancaGerarController } from './controllers/CobrancaGerarController';
import { CobrancaGerarItensController } from './controllers/CobrancaGerarItensController';
import { ExtratoGerarController } from './controllers/ExtratoGerarController';
import { ExtratoGerarDetalhadoController } from './controllers/ExtratoGerarDetalhadoController';
import { ProdutoCadastrarController } from './controllers/ProdutoCadastrarController';
import { ProdutoCadastrarItemController } from './controllers/ProdutoCadastrarItemController';
import { ProdutoCadastrarCategoriaController } from './controllers/ProdutoCadastrarCategoriaController';
import { TransacaoCadastrarController } from './controllers/TransacaoCadastrarController';

import { authMiddleware } from './middlewares/authJWT';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send("api rodando!");
});

router.post('/verifica', authMiddleware, (req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.post('/empresa/cadastrar', (req: Request, res: Response) => {
  new EmpresaCadastrarController().handle(req, res);
});

router.post('/empresa/login', (req: Request, res: Response) => {
  new EmpresaLoginController().handle(req, res);
});

router.post('/cobranca/gerar', authMiddleware,(req: Request, res: Response) => {
  new CobrancaGerarController().handle(req, res);
});

router.post('/cobranca/gerar/itens', authMiddleware, (req: Request, res: Response) => {
  new CobrancaGerarItensController().handle(req, res);
});

router.get('/validar', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Autorizado"});
});

router.post('/extrato/gerar', authMiddleware, (req: Request, res: Response) => {
  new ExtratoGerarController().handle(req, res);
});

router.post('/extrato/gerar/detalhado', authMiddleware, (req: Request, res: Response) => {
  new ExtratoGerarDetalhadoController().handle(req, res);
});

router.post('/produto/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new ProdutoCadastrarController().handle(req, res);
});

router.post('/produto/cadastrar/item', authMiddleware, (req: Request, res: Response) => {
  new ProdutoCadastrarItemController().handle(req, res);
});

router.post('/produto/cadastrar/categoria', authMiddleware, (req: Request, res: Response) => {
  new ProdutoCadastrarCategoriaController().handle(req, res);
});

router.post('/transacao/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new TransacaoCadastrarController().handle(req, res);
});

export default router;
