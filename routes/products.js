import express from "express";
import supabase from "../supabaseClient.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// ── GET ALL PRODUCTS ───────────────────────────────
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Always return array
  return res.status(200).json(data || []);
});

// ── GET SINGLE PRODUCT ────────────────────────────
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(data);
});

// ── CREATE PRODUCT ────────────────────────────────
router.post("/", requireAuth, async (req, res) => {
  const { name, price, category, stock, description, image } = req.body;

  if (!name || !price || !category || !stock) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        image,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

// ── UPDATE PRODUCT ────────────────────────────────
router.patch("/:id", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
});

// ── DELETE PRODUCT ────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "Product deleted" });
});

export default router;
