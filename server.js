import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import fs from "fs";

import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import { handleWebhook } from "./controllers/paymentController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "frontend", "dist");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(cors());

//raw body for paystack
app.post(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

// Normal JSON parsing for other routes
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve frontend
app.use(express.static(distPath));

// React catch-all fallback — serves index.html for ALL non-API routes
// Express v5 requires named wildcards: /{*splat} instead of *
app.get("/{*splat}", (req, res) => {
  res.sendFile("index.html", { root: distPath });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log("DIST PATH:", distPath);
console.log(
  "FILES:",
  fs.existsSync(distPath) ? fs.readdirSync(distPath) : "NOT FOUND",
);
