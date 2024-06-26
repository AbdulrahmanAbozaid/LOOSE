import { Router } from "express";
import UserRoutes from "./user/routes"
import ProductRoutes from "./product/routes";
import CategoryRoutes from "./category/routes";
import OrderRoutes from "./order/routes";

const app: Router = Router();

app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/categories", CategoryRoutes);
app.use("/orders", OrderRoutes);

export default app;
