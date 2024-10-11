import express from 'express';
import routes from './routes.js';

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Use as rotas importadas
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});