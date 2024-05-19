import { Router } from "express";
import v1Api from './v1.routes.js';
var app = Router();
app.use('/api/v1', v1Api);
app.get("/", function (req, res) {
  res.json({
    message: "Welcome to the LOOSE"
  });
});
export default app;