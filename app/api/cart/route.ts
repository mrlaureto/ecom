import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('ecom_db');

    const cart = await db.collection('carts').findOne({ userId: userId });
    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart.items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('ecom_db');

    const item = await request.json(); // Get the item from the request body

    const cart = await db.collection('carts').findOne({ userId: userId });

    if (cart) {
      // Update existing cart
      const updatedItems = [...cart.items, item];
      await db.collection('carts').updateOne(
        { userId: userId },
        { $set: { items: updatedItems, updatedAt: new Date() } }
      );
    } else {
      // Create new cart
      const newCart = {
        userId: userId,
        items: [item],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection('carts').insertOne(newCart);
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.error();
  }
}

export async function DELETE(req: NextRequest) {
  try {
      const { userId } = getAuth(req);
      if (!userId) {
          return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
      }

      const client = await clientPromise;
      const db = client.db('ecom_db');
      const collection = db.collection('carts');

      // Clear the user's cart
      const result = await collection.updateOne(
          { userId: userId },
          { $set: { items: [], updatedAt: new Date() } }
      );

      console.log('Clear cart result:', result);

      if (result.matchedCount === 0) {
          console.log('Cart not found for userId:', userId);
          return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Cart cleared' }, { status: 200 });
  } catch (error) {
      console.error('Error clearing cart:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}