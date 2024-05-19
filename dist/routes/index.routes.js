import { Router } from "express";
import v1Api from './v1.routes.js';
const app = Router();
app.use('/api/v1', v1Api);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the LOOSE",
    });
});
export default app;
