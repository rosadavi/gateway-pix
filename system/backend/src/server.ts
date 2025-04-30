import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import routes from './routes.js';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

// Declare módulos para o TypeScript entender os tipos da session
declare module 'express-session' {
  interface SessionData {
    // Defina os tipos dos dados que você irá armazenar na session
    userId: string;
    isAuthenticated: boolean;
    // Outros dados que você queira armazenar
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// const options = {
//   key: fs.readFileSync('./certs/server.key'),
//   cert: fs.readFileSync('./certs/server.cert')
// };

app.use(session({
  secret: process.env.SESSION_KEY, // Chave usada para assinar o cookie de session
  resave: false, // Evita salvar a session se não for modificada
  saveUninitialized: false, // Evita criar sessions vazias
  cookie: { 
    secure: false, // HTTPS em produção / Usa false pra testes locais
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));
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