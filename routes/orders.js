import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// GET single order
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "Order not found" });
  res.status(200).json(data);
});

// GET by reference
router.get("/reference/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("reference", req.params.ref)
    .single();

  if (error) return res.status(404).json({ error: "Not found" });

  res.json(data);
});

// POST to create order......
router.post("/", async (req, res) => {
  const { customer, email, items, status, total } = req.body;

  if (!customer || !total) {
    return res.status(400).json({ error: "Customer and total are required" });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer,
        email,
        items,
        status: status || "Pending",
        total: Number(total),
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH update order status
router.patch("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

export default router;
