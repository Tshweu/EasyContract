import App from './index';
import express,{Express} from 'express';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
new App(app).config();
