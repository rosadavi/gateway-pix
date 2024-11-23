import express from 'express';
import { engine } from 'express-handlebars';
import routes from './routes.js';
import path from 'path';

const app = express();
const PORT = 3001;
const __filename = path.join(process.cwd(), 'src', 'routes.ts');
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'src', 'views'));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});