import express from "express";
import {
  getAllOrders,
  getOrder,
  deleteOrder
} from "../../controller/order.controller";
import { authorize } from './../../utils/auth.service';

const router = express.Router();

// Route to get all orders
router.route('/').get(authorize, getAllOrders);

// Routes to get an order by ID and delete an order
router.route('/:id')
	.all(authorize)
  .get(getOrder)
  .delete(deleteOrder);

export default router;
