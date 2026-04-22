const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getOrdersByUser, getOrderById } = require("../models/Order");

const router = express.Router();

function validateOrderPayload(body) {
  const errors = [];
  const items = Array.isArray(body.items) ? body.items : [];
  const shippingAddress = body.shippingAddress || {};

  if (items.length === 0) {
    errors.push("At least one order item is required");
  }

  items.forEach((item, index) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);

    if (!item.productId) {
      errors.push(`items[${index}].productId is required`);
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push(`items[${index}].quantity must be a positive number`);
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      errors.push(`items[${index}].unitPrice must be a valid number`);
    }
  });

  const requiredAddressFields = ["line1", "city", "state", "postalCode"];
  requiredAddressFields.forEach((field) => {
    if (!shippingAddress[field]) {
      errors.push(`shippingAddress.${field} is required`);
    }
  });

  return errors;
}

router.post("/", authMiddleware, (req, res) => {
  const errors = validateOrderPayload(req.body || {});
  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid order payload",
      errors
    });
  }

  const order = createOrder({
    userId: req.user.id,
    items: req.body.items,
    shippingAddress: req.body.shippingAddress,
    note: req.body.note
  });

  return res.status(201).json({
    message: "Order created successfully",
    order
  });
});

router.get("/my", authMiddleware, (req, res) => {
  const orders = getOrdersByUser(req.user.id);
  return res.status(200).json({
    count: orders.length,
    items: orders
  });
});

router.get("/:id", authMiddleware, (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  if (order.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden: this order belongs to another user"
    });
  }

  return res.status(200).json({
    order
  });
});

module.exports = router;
