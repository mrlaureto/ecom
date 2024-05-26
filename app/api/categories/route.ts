import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// Helper function to fetch categories
async function getCategories() {
  const client = await clientPromise;
  const db = client.db('ecom_db');
  const categories = await db.collection('categories').find({}).toArray();
  return categories;
}

// GET method handler
export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
