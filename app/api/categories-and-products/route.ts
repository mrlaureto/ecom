import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { Category, Product } from '@/app/types/interface';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('ecom_db');

    // Fetch categories and products as any[]
    const categories: any[] = await db.collection('categories').find({}).toArray();
    const products: any[] = await db.collection('products').find({}).toArray();

    // Transform categories and calculate items count for each category
    const categoriesWithCount: Category[] = categories.map((category) => {
      const itemsCount = products.filter(product => product.category_id === category._id.toString()).length;
      return {
        _id: category._id.toString(),
        category_name: category.category_name,
        category_pill_image: category.category_pill_image,
        category_background_image: category.category_background_image,
        color: category.color,
        items_count: itemsCount,
        span: category.span || { row: 1, col: 1 }, // Provide a default value or use the existing value
      };
    });

    // Transform products to match Product type
    const transformedProducts: Product[] = products.map((product) => ({
      _id: product._id.toString(),
      product_title: product.product_title,
      description: product.description,
      image_background: product.image_background,
      price: product.price,
      category_id: product.category_id.toString(),
    }));

    return NextResponse.json({ categories: categoriesWithCount, products: transformedProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
