
import { NextResponse } from 'next/server';

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json([
    {
      itemId: 'coffee',
      imageId: 'coffee',
      title: 'Coffee',
      price: 0.99,
      description: '',
      salePrice: 0,
    },
    {
      itemId: 'cookie',
      imageId: 'cookie',
      title: 'Cookie',
      price: 1,
      description: 'May contain nuts.',
      salePrice: 0.50,
    },
    {
      itemId: 'croissant',
      imageId: 'croissant',
      title: 'Croissant',
      price: 2.50,
    },
    {
      itemId: 'cupcake',
      imageId: 'cupcake',
      title: 'Cupcake',
      price: 3,
    },
    {
      itemId: 'french-press',
      imageId: 'french-press',
      title: 'French Press',
      price: 1.75,
    },
    {
      itemId: 'iced-coffee',
      imageId: 'iced-coffee',
      title: 'Iced Coffee',
      price: 1.25,
    },
    {
      itemId: 'latte',
      imageId: 'latte',
      title: 'Latte',
      price: 2,
    },
    {
      itemId: 'milk',
      imageId: 'milk',
      title: 'Milk',
      price: 0.50,
    },
    {
      itemId: 'sandwich',
      imageId: 'sandwich',
      title: 'Sandwich',
      price: 6,
    },
    {
      itemId: 'tea',
      imageId: 'tea',
      title: 'Tea',
      price: 1.50,
    },
  ]);
}
