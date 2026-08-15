import { Router } from "express";
import {
  getOrders,
  getOrderById,
  getOrderByReference,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.get("/reference/:ref", getOrderByReference);
router.post("/", createOrder);
router.patch("/:id", updateOrderStatus);

export default router;
