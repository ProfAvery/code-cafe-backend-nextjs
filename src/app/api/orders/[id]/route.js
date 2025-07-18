
import { NextResponse } from 'next/server';
import * as orderData from '@/data/orders';
import { authMiddleware } from '@/middleware/auth';
import sendOrders from '@/utils/broadcast';

export async function GET(request, props) {
  const params = await props.params;
  const id = params.id;

  const order = await orderData.getOrder(id);
  if (order) {
    return NextResponse.json(order);
  } else {
    return NextResponse.json({ message: 'No order found' }, { status: 404 });
  }
}

async function putHandler(request, props) {
  const params = await props.params;
  const id = params.id;

  const order = await orderData.getOrder(id);
  if (!order) {
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
  const id = params.id;

  if (!await orderData.deleteOrder(id)) {
    return new Response(null, { status: 404 });
  } else {
    await sendOrders();
    return NextResponse.json({ message: `Successfully deleted coffee order ${id}` });
  }
}

export const PUT = authMiddleware(putHandler);
export const DELETE = authMiddleware(deleteHandler);
