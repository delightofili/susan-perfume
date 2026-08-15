import { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Get products error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, stock, description, image } = req.body;

    if (!name || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ error: "Name, price, category, and stock are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description: description || "",
        image: image || "",
      },
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, stock, description, image } = req.body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (price !== undefined) dataToUpdate.price = Number(price);
    if (category !== undefined) dataToUpdate.category = category;
    if (stock !== undefined) dataToUpdate.stock = Number(stock);
    if (description !== undefined) dataToUpdate.description = description;
    if (image !== undefined) dataToUpdate.image = image;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to delete product" });
  }
};
