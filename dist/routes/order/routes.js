import express from "express";
import { getAllOrders, getOrder, deleteOrder, saleStatistics, } from "../../controller/order.controller";
import { authorize } from "./../../utils/auth.service";
const router = express.Router();
router.route("/best-sales").all(authorize).get(saleStatistics);
router.route("/").get(authorize, getAllOrders);
router.route("/:id").all(authorize).get(getOrder).delete(deleteOrder);
export default router;
