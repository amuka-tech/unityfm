import { NextResponse } from 'next/server';
import { getScheduleScheduleDb } from '@/lib/server-actions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getScheduleScheduleDb();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}
