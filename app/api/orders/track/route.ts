import { NextRequest, NextResponse } from 'next/server';
import { getOrderByIdAndEmail } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Please provide both Order Reference ID and Email Address to track your order.' },
        { status: 400 }
      );
    }

    const order = await getOrderByIdAndEmail(id, email);
    if (!order) {
      return NextResponse.json(
        { error: 'No order found matching this Order ID and Email combination. Please check your credentials.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
