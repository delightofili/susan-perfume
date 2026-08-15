import { Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch order" });
  }
};

export const getOrderByReference = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { reference: req.params.ref },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch order by reference" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { reference, customer, email, items, status, total } = req.body;

    if (!customer || total === undefined) {
      return res.status(400).json({ error: "Customer and total are required" });
    }

    const orderRef = reference || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        reference: orderRef,
        customer,
        email: email || "",
        items: items || [],
        status: status || "Pending",
        total: Number(total),
      },
    });

    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to create order" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, reference, customer, email, items, total } = req.body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (reference !== undefined) dataToUpdate.reference = reference;
    if (customer !== undefined) dataToUpdate.customer = customer;
    if (email !== undefined) dataToUpdate.email = email;
    if (items !== undefined) dataToUpdate.items = items;
    if (total !== undefined) dataToUpdate.total = Number(total);

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });

    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update order" });
  }
};
