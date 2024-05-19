import express from "express";
import { getAllOrders, getOrder, deleteOrder, saleStatistics, viewStatistics } from "../../controller/order.controller.js";
import { authorize } from "./../../utils/auth.service.js";
var router = express.Router();
router.route("/best-sales").all(authorize).get(saleStatistics);
router.route("/best-views").all(authorize).get(viewStatistics);

// Route to get all orders
router.route("/").get(authorize, getAllOrders);

// Routes to get an order by ID and delete an order
router.route("/:id").all(authorize).get(getOrder)["delete"](deleteOrder);
export default router;