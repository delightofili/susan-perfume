import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import { handleWebhook } from "./controllers/paymentController.js";
import { createRequire } from "module";
import { readFileSync } from "fs";

dotenv.config();

// ── Fix __dirname for ES Modules on Windows ──────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, "frontend", "dist");

console.log("Serving frontend from:", distPath);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ── API Routes ───────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.post("/api/paystack/webhook", handleWebhook);

// ── Serve React Frontend ─────────────────────────────
app.use(express.static(distPath));

// ── React Router Fallback ────────────────────────────
app.get("/{*path}", (req, res) => {
  res.sendFile("index.html", { root: distPath });
});

// ── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
