import { NextRequest, NextResponse } from 'next/server';
import { trackOrder, getOrderById } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const query = searchParams.get('query');

    if (id) {
      const order = await getOrderById(id);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    if (query) {
      const orders = await trackOrder(query);
      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: 'Please provide an id or query parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
