import express, { Request, Response, NextFunction } from 'express';
import routes from './routes.js';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// const options = {
//   key: fs.readFileSync('./certs/server.key'),
//   cert: fs.readFileSync('./certs/server.cert')
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server is running at ${PORT}`);
// });