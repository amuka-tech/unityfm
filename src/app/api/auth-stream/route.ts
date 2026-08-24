export const dynamic = 'force-static';
﻿import { NextRequest, NextResponse } from 'next/server';
import { validateStreamKeyDb } from '@/lib/server-actions';

/**
 * Nginx-RTMP Authentication Webhook
 * 
 * Invoked by Nginx `on_publish http://localhost:3000/api/auth-stream;`
 * when vMix or OBS initiates a broadcast connection.
 */
export async function POST(req: NextRequest) {
  try {
    let streamKey = '';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      // Nginx-RTMP passes stream key as 'name' parameter
      streamKey = (formData.get('name') || formData.get('stream_key') || formData.get('key') || '') as string;
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      streamKey = json.name || json.stream_key || json.key || '';
    } else {
      // Fallback url parameters
      const url = new URL(req.url);
      streamKey = url.searchParams.get('name') || url.searchParams.get('key') || '';
    }

    if (!streamKey) {
      console.warn('[RTMP Auth Webhook] Rejected: Missing stream key parameter.');
      return new NextResponse('Forbidden: Missing stream key', { status: 403 });
    }

    const isValid = await validateStreamKeyDb(streamKey.trim());

    if (isValid) {
      console.log(`[RTMP Auth Webhook] Accepted stream key: ${streamKey}`);
      // Return 200 OK to allow Nginx-RTMP to start ingesting video
      return new NextResponse('OK', { status: 200 });
    } else {
      console.warn(`[RTMP Auth Webhook] Rejected unauthorized stream key: ${streamKey}`);
      // Return 403 Forbidden to drop the connection
      return new NextResponse('Forbidden: Invalid or inactive stream key', { status: 403 });
    }
  } catch (error) {
    console.error('[RTMP Auth Webhook] Internal validation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Unity TV RTMP Ingest Webhook',
    status: 'online',
    protocol: 'Nginx-RTMP on_publish gatekeeper',
  });
}
