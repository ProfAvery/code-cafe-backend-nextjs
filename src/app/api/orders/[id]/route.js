
import { NextResponse } from 'next/server';
import * as orderData from '@/data/orders';
import { authMiddleware } from '@/middleware/auth';

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

export async function GET(request, props) {
  const params = await props.params;
  const id = Number(params.id);

  const order = orderData.getOrders().find(({ id: targetId }) => targetId === id);
  if (order) {
    return NextResponse.json(order);
  } else {
    return NextResponse.json({ message: 'No order found' }, { status: 404 });
  }
}

async function putHandler(request, props) {
  const params = await props.params;
  const id = Number(params.id);

  if (!orderData.getOrders().some(({ id: targetId }) => targetId === id)) {
    return new Response(null, { status: 404 });
  } else {
    const editedOrder = await request.json();
    const result = await orderData.editOrder(id, editedOrder);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    await sendOrders();
    return NextResponse.json(result.order);
  }
}

async function deleteHandler(request, props) {
  const params = await props.params;
  const id = Number(params.id);
  const orders = orderData.getOrders();

  if (!orders.some(({ id: targetId }) => targetId === id)) {
    return new Response(null, { status: 404 });
  } else {
    orderData.deleteOrder(id);
    await sendOrders();
    return NextResponse.json({ message: `Successfully deleted coffee order ${id}` });
  }
}

export const PUT = authMiddleware(putHandler);
export const DELETE = authMiddleware(deleteHandler);
