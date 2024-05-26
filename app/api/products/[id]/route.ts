import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Adjust the import path if necessary
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('ecom_db'); // Replace with your database name
        const collection = db.collection('products'); // Replace with your collection name

        const product = await collection.findOne({ _id: new ObjectId(id) });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
