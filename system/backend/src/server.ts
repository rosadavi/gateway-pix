import express from 'express';
import routes from './routes.js';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.cert')
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
//https.createServer(options, app).listen(PORT, () => {
//  console.log(`Server is running at ${PORT}`);
//});