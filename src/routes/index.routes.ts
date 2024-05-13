import { Router, Request, Response } from "express";
import v1Api from './v1.routes.js'
const app: Router = Router();

app.use('/api/v1', v1Api);

app.get("/", (req: Request, res: Response) => {
	res.json({
	  message: "Welcome to the LOOSE",
	});
  });

export default app;