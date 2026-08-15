import { Router } from "express";
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", getCart);
router.post("/", addItem);
router.patch("/:id", updateQuantity);
router.delete("/:id", removeItem);
router.delete("/clear/:cartId", clearCart);

export default router;
