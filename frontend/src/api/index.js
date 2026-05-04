import supabase from "../supabase.js";

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get auth headers
const getHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };
};

// Public — no auth needed
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

// Protected — needs token
export const createProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const updateOrder = async (id, updates) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
};
