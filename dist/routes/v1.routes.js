import { Router } from "express";
import UserRoutes from "./user/routes.js";
import ProductRoutes from "./product/routes.js";
import CategoryRoutes from "./category/routes.js";
import OrderRoutes from "./order/routes.js";
var app = Router();
app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/categories", CategoryRoutes);
app.use("/orders", OrderRoutes);
export default app;