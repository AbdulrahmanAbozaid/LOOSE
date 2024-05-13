import { Router } from "express";
import UserRoutes from "./user/routes"
const app: Router = Router();

app.use("/users", UserRoutes);

export default app;
