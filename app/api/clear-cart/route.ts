import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
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
