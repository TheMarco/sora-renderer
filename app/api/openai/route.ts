import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, method = 'POST', apiKey, data } = body;

    console.log('[API Proxy] Request:', { endpoint, method, hasApiKey: !!apiKey, data });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const url = `${OPENAI_API_BASE}${endpoint}`;
    console.log('[API Proxy] Calling:', url);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    });

    console.log('[API Proxy] Response status:', response.status);

    // Try to parse response as JSON
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      console.log('[API Proxy] Non-JSON response:', text);
      responseData = { error: { message: text || 'Non-JSON response from API' } };
    }

    if (!response.ok) {
      console.error('[API Proxy] Error response:', responseData);
      return NextResponse.json(
        { error: responseData.error?.message || 'API request failed', details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[API Proxy] Exception:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    const apiKey = searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const url = `${OPENAI_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error?.message || 'API request failed', details: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

