import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from the main route!');
});

router.get('/about', (req: Request, res: Response) => {
  res.send('About page');
});

export default router;