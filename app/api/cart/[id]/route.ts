import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        }

        const productId = params.id;
        const { quantity } = await req.json();
        console.log('Received productId and quantity:', productId, quantity);

        if (typeof quantity !== 'number' || quantity <= 0) {
            console.log('Invalid quantity:', quantity);
            return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('ecom_db');
        const collection = db.collection('carts');

        // Update the specific item's quantity in the user's cart
        const result = await collection.updateOne(
            { userId: userId, 'items.product_id': productId },
            { $set: { 'items.$.quantity': quantity, updatedAt: new Date() } }
        );

        console.log('Update result:', result);

        if (result.matchedCount === 0) {
            console.log('Item not found for productId:', productId);
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const updatedCart = await collection.findOne({ userId: userId });
        console.log('Updated cart:', updatedCart);

        return NextResponse.json(updatedCart, { status: 200 });
    } catch (error) {
        console.error('Error updating item quantity:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
