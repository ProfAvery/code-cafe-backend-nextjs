import { JSONFilePreset } from 'lowdb/node'
const db = await JSONFilePreset('db.json', { orders: [] });

const validateOrder = (order) => {
  if (!order) {
    return { error: 'Missing body', valid: false };
  }
  if (typeof order.name !== 'string' || !order.name.trim()) {
    return { error: 'Invalid Name', valid: false };
  }
  if (!order.zipCode || !/^[0-9]{5}$/i.test(order.zipCode)) {
    return { error: 'Invalid Zip Code', valid: false };
  }
  if (order.zipCode === '99999') {
    return { error: "We don't ship to 99999.", valid: false };
  }
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return { error: 'You must order at least one item.', valid: false };
  }
  return { valid: true };
};

const createOrder = async (order) => {
  const result = validateOrder(order);
  if (!result.valid) {
    return { success: false, ...result };
  }

  const newOrder = {
    id: db.data.orders.length + 1,
    name: order.name,
    phone: order.phone,
    zipCode: order.zipCode,
    items: order.items,
  };
  await db.update(({ orders }) => {
    orders.push(newOrder);
  });
  return { success: true };
};

const deleteOrders = async () => {
  await db.update(({ orders }) => {
    db.data.orders = [];
  });
};

const deleteOrder = async (id) => {
  await db.update(({ orders }) => {
    db.data.orders = orders.filter((order) => order.id !== id);
  });
};

const editOrder = async (id, editedOrder) => {
  const result = validateOrder(editedOrder);
  if (!result.valid) {
    return { success: false, ...result };
  }

  await db.update(({ orders }) => {
    db.data.orders = orders.map((order) => (order.id === id ? {
      ...order,
      items: editedOrder.items,
      name: editedOrder.name,
      phone: editedOrder.phone,
      zipCode: editedOrder.zipCode,
    } : order));
  });

  return { success: true, order: db.data.orders.find((order) => order.id === id) };
};

const getOrders = () => db.data.orders;

export {
  createOrder,
  deleteOrders,
  deleteOrder,
  editOrder,
  getOrders,
  validateOrder,
};
