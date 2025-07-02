
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

// TODO: Use JWT to verify that user is an associate
export async function PUT(request, props) {
  const params = await props.params;
  const id = Number(params.id);

  if (!orderData.getOrders().some(({ id: targetId }) => targetId === id)) {
    return new Response(null, { status: 404 });
  } else {
    const editedOrder = await request.json();
    const result = orderData.editOrder(id, editedOrder);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    await sendOrders();
    return NextResponse.json(result.order);
  }
}

// TODO: Use JWT to verify that user is an associate
export async function DELETE(request, props) {
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
