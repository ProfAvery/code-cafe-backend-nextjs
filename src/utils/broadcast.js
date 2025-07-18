import * as orderData from '@/data/orders';

export default async function sendOrders() {
  const orders = await orderData.getOrders();
  try {
    await fetch('http://localhost:8080/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders),
    });
  } catch (error) {
    console.error('Failed to broadcast order update:', error);
  }
};
