
import { NextResponse } from 'next/server';
import * as orderData from '@/data/orders';

const sendOrders = async () => {
  try {
    await fetch('http://localhost:8080/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData.getOrders()),
    });
  } catch (error) {
    console.error('Failed to broadcast order update:', error);
  }
};

export async function GET() {
  return NextResponse.json(orderData.getOrders());
}

export async function POST(request) {
  const order = await request.json();
  const result = await orderData.createOrder(order);
  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }
  await sendOrders();
  return new Response(null, { status: 201 });
}

export async function DELETE() {
  orderData.deleteOrders();
  await sendOrders();
  return NextResponse.json({ message: 'deleted all orders' });
}
