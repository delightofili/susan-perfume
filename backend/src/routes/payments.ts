import { Router, raw } from "express";
import { handleWebhook } from "../controllers/paymentController.js";

const router = Router();

// Paystack requires raw body for cryptographic signature validation
router.post("/webhook", raw({ type: "application/json" }), handleWebhook);

export default router;
