import { Router, Request, Response } from 'express';

import { VerificaCPFeCNPJController } from './controllers/VerificaCPFeCNPJController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from the main route!');
});

router.get('/about', (req: Request, res: Response) => {
  res.send('About page');
});

router.post('/verifica',(req: Request, res: Response) => {
   new VerificaCPFeCNPJController().handle(req, res);
}


)


export default router;