import { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getCart = async (req: Request, res: Response) => {
  const { cartId } = req.query;

  if (!cartId || typeof cartId !== "string") {
    return res.status(400).json({ error: "cartId query parameter is required" });
  }

  try {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch cart items" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  const { cartId, productId, name, price, image } = req.body;

  if (!cartId || !productId || !name || price === undefined) {
    return res.status(400).json({ error: "cartId, productId, name, and price are required" });
  }

  try {
    // Check if item already exists in this cart
    const existing = await prisma.cartItem.findFirst({
      where: { cartId, productId: String(productId) },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 },
      });
      return res.status(200).json(updated);
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId,
        productId: String(productId),
        name,
        price: Number(price),
        image: image || "",
        quantity: 1,
      },
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to add item to cart" });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || Number(quantity) < 1) {
    return res.status(400).json({ error: "Valid quantity is required" });
  }

  try {
    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity: Number(quantity) },
    });

    return res.status(200).json(item);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update cart item quantity" });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.cartItem.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to remove item from cart" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to clear cart" });
  }
};
