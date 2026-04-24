const { randomUUID } = require("crypto");

const orders = [];

function normalizeItems(items) {
  return items.map((item) => {
    return {
      productId: String(item.productId),
      name: String(item.name || "Gift Item"),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice)
    };
  });
}

function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);
}

function createOrder({ userId, items, shippingAddress, note }) {
  const normalizedItems = normalizeItems(items);
  const totalAmount = Number(calculateTotal(normalizedItems).toFixed(2));

  const order = {
    id: randomUUID(),
    userId,
    items: normalizedItems,
    shippingAddress: {
      line1: String(shippingAddress.line1),
      city: String(shippingAddress.city),
      state: String(shippingAddress.state),
      postalCode: String(shippingAddress.postalCode),
      country: String(shippingAddress.country || "US")
    },
    note: note ? String(note) : "",
    totalAmount,
    status: "processing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(order);
  return order;
}

function getOrdersByUser(userId) {
  return orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getOrderById(orderId) {
  return orders.find((entry) => entry.id === orderId) || null;
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById
};
