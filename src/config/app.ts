import express, { Express } from 'express';
import cors from 'cors';
import API from '../routes/index.routes.js';

const app: Express = express();

app.use(cors({
	allowedHeaders: '*',
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(API);

export default app;

