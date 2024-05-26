import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

async function createCartForUser(userId: string) {
  try {
    const client = await clientPromise;
    const database = client.db('ecom_db');
    const carts = database.collection('carts');
    const newCart = {
      userId: userId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await carts.insertOne(newCart);
    console.log(`Cart created for user ID: ${userId}`);
  } catch (error) {
    console.error('Error creating cart for user:', error);
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not found');
    return new Response('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local', { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error('Error parsing JSON payload:', err);
    return new Response('Invalid JSON payload', { status: 400 });
  }

  const body = JSON.stringify(payload);
  let evt: WebhookEvent;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred during verification', { status: 400 });
  }

  const { id } = evt.data;  
  const eventType = evt.type;
  console.log(`Webhook with ID: ${id}, Type: ${eventType}`);
  console.log('Webhook body:', body);

  // Create a cart for the user when they sign up
  if (eventType === 'user.created') {
    const userId = evt.data.id;
    await createCartForUser(userId);
  }

  return new Response('Webhook received and verified', { status: 200 });
}
