import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

// Use as rotas importadas
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});