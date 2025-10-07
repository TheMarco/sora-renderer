import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle multipart/form-data (for image uploads)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const endpoint = formData.get('endpoint') as string;
      const apiKey = formData.get('apiKey') as string;
      const method = (formData.get('method') as string) || 'POST';

      console.log('[API Proxy] Multipart request:', { endpoint, method, hasApiKey: !!apiKey });

      if (!apiKey) {
        return NextResponse.json({ error: 'API key is required' }, { status: 401 });
      }

      if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
      }

      // Create new FormData for OpenAI API (without our proxy fields)
      const openaiFormData = new FormData();
      formData.forEach((value, key) => {
        if (key !== 'endpoint' && key !== 'apiKey' && key !== 'method') {
          openaiFormData.append(key, value);
        }
      });

      const url = `${OPENAI_API_BASE}${endpoint}`;
      console.log('[API Proxy] Calling:', url);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: openaiFormData,
      });

      console.log('[API Proxy] Response status:', response.status);

      const responseContentType = response.headers.get('content-type');

      // Handle binary responses (video/image downloads)
      if (responseContentType && (responseContentType.includes('video/') || responseContentType.includes('image/'))) {
        console.log('[API Proxy] Returning binary response:', responseContentType);
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
          status: response.status,
          headers: {
            'Content-Type': responseContentType,
            'Content-Length': buffer.byteLength.toString(),
          },
        });
      }

      // Handle JSON responses
      let responseData;
      if (responseContentType && responseContentType.includes('application/json')) {
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
    }

    // Handle JSON requests (existing code)
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

    const jsonResponseContentType = response.headers.get('content-type');

    // Handle binary responses (video/image downloads)
    if (jsonResponseContentType && (jsonResponseContentType.includes('video/') || jsonResponseContentType.includes('image/'))) {
      console.log('[API Proxy] Returning binary response:', jsonResponseContentType);
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': jsonResponseContentType,
          'Content-Length': buffer.byteLength.toString(),
        },
      });
    }

    // Handle JSON responses
    let responseData;
    if (jsonResponseContentType && jsonResponseContentType.includes('application/json')) {
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

