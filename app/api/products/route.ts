import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function getProducts() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB');
    
    const db = client.db('ecom_db');
    const products = await db.collection('products').find({}).toArray();
    console.log('Fetched products:', products);
    
    return products;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Handling GET request');
    const products = await getProducts();
    console.log('Products fetched successfully');
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
