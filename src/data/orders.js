import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';

let mongod = null;
let client = null;

const getCollection = async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }

  const uri = mongod.getUri();
  if (!client) {
    client = new MongoClient(uri);
  }

  const db = client.db('code-cafe');
  return db.collection('orders');
}

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
    name: order.name,
    phone: order.phone,
    zipCode: order.zipCode,
    items: order.items,
  };

  const orders = await getCollection();
  await orders.insertOne(newOrder);

  return { success: true };
};

const deleteOrders = async () => {
  const orders = await getCollection();
  await orders.deleteMany({});
};

const deleteOrder = async (id) => {
  const _id = ObjectId.createFromHexString(id);
  
  const orders = await getCollection();
  const result = await orders.deleteOne({ _id });

  return (result.deletedCount === 1);
};

const editOrder = async (id, editedOrder) => {
  const _id = ObjectId.createFromHexString(id);
  const result = validateOrder(editedOrder);
  if (!result.valid) {
    return { success: false, ...result };
  }

  const orders = await getCollection();
  await orders.updateOne({ _id }, { $set: editedOrder });

  return {
    success: true,
    order: await orders.findOne({ _id }),
  };
};

const getOrder = async (id) => {
  const _id = ObjectId.createFromHexString(id);

  const orders = await getCollection();
  const order = await orders.findOne({ _id });

  return order;
};

const getOrders = async () => {
  const orders = await getCollection();
  return await orders.find().toArray();
};

export {
  createOrder,
  deleteOrders,
  deleteOrder,
  editOrder,
  getOrder,
  getOrders,
  validateOrder,
};
