import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function getTestimonials() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB');
    
    const db = client.db('ecom_db');
    const testimonials = await db.collection('person_testimonials').find({}).toArray();
    console.log('Fetched testimonials:', testimonials);
    
    return testimonials;
  } catch (error) {
    console.error('Error in gettestimonials:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Handling GET request');
const testimonials = await getTestimonials();
    console.log('testimonials fetched successfully');
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
