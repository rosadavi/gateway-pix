import { Router, Request, Response } from 'express';

import { EmpresaCadastrarController } from './controllers/EmpresaCadastrarController';
import { EmpresaLoginController } from './controllers/EmpresaLoginController';
import { CobrancaGerarController } from './controllers/CobrancaGerarController';
import { PedidoItemGerarController } from './controllers/PedidoItemGerarController';
import { CobrancaItemGerarController } from './controllers/CobrancaItemGerarController';
import { ExtratoGerarController } from './controllers/ExtratoGerarController';
import { ExtratoDetalhadoGerarController } from './controllers/ExtratoDetalhadoGerarController';
import { ProdutoCadastrarController } from './controllers/ProdutoCadastrarController';
import { ProdutoItemCadastrarController } from './controllers/ProdutoItemCadastrarController';
import { ProdutoCategoriaCadastrarController } from './controllers/ProdutoCategoriaCadastrarController';
import { TransacaoCadastrarController } from './controllers/TransacaoCadastrarController';

import { authMiddleware } from './middlewares/authMiddleware';
import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController';

const router = Router();

router.post('/empresa/cadastrar', (req: Request, res: Response) => {
  new EmpresaCadastrarController().handle(req, res);
});

router.post('/empresa/login', (req: Request, res: Response) => {
  new EmpresaLoginController().handle(req, res);
});

router.post('/cobranca/gerar', authMiddleware,(req: Request, res: Response) => {
  new CobrancaGerarController().handle(req, res);
});

router.post('/pedido/item/gerar', authMiddleware, (req: Request, res: Response) => {
  new PedidoItemGerarController().handle(req, res);
});

router.post('/cobranca/item/gerar', authMiddleware, (req: Request, res: Response) => {
  new CobrancaItemGerarController().handle(req, res);
});

router.post('/extrato/gerar', authMiddleware, (req: Request, res: Response) => {
  new ExtratoGerarController().handle(req, res);
});

router.post('/extrato/detalhado/gerar', authMiddleware, (req: Request, res: Response) => {
  new ExtratoDetalhadoGerarController().handle(req, res);
});

router.post('/produto/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new ProdutoCadastrarController().handle(req, res);
});

router.post('/produto/item/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new ProdutoItemCadastrarController().handle(req, res);
});

router.post('/produto/categoria/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new ProdutoCategoriaCadastrarController().handle(req, res);
});

router.post('/transacao/cadastrar', authMiddleware, (req: Request, res: Response) => {
  new TransacaoCadastrarController().handle(req, res);
});

router.get('/', (req: Request, res: Response) => {
  res.send("api rodando!");
});

router.post('/verifica', authMiddleware, (req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
});

router.get('/validar', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({message: "Autorizado"});
});

export default router;
