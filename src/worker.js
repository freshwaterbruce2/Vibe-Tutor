/**
 * Cloudflare Worker for Vibe-Tutor API
 * Handles API requests and connects to local database via Cloudflare Tunnel
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      const path = url.pathname;

      // Health check endpoint
      if (path === '/api/health') {
        return handleHealthCheck(env);
      }

      // Session initialization
      if (path === '/api/session/init' && request.method === 'POST') {
        return handleSessionInit(env, ctx);
      }

      // Chat endpoint (with rate limiting and content filtering)
      if (path === '/api/chat' && request.method === 'POST') {
        return handleChat(request, env, ctx);
      }

      // Stats endpoint
      if (path.startsWith('/api/stats/')) {
        return handleStats(request, env);
      }

      // Database proxy endpoint (for local SQLite access)
      if (path.startsWith('/api/db/')) {
        return handleDatabaseProxy(request, env);
      }

      // Default 404
      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};

// Health check handler
async function handleHealthCheck(env) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: env.API_VERSION
  };

  return new Response(JSON.stringify(health), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Session initialization handler
async function handleSessionInit(env, ctx) {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    token: sessionId,
    createdAt: Date.now(),
    expiresIn: 1800 // 30 minutes
  };

  // Store session in Durable Object or KV
  if (env.CACHE) {
    await env.CACHE.put(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      { expirationTtl: 1800 }
    );
  }

  return new Response(JSON.stringify({
    token: sessionId,
    expiresIn: 1800
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Chat handler with content filtering
async function handleChat(request, env, ctx) {
  const body = await request.json();
  const authHeader = request.headers.get('Authorization');

  // Validate session
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.replace('Bearer ', '');

  // Check session in cache
  if (env.CACHE) {
    const session = await env.CACHE.get(`session:${token}`);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Content filtering
  const inappropriate = checkInappropriateContent(body.messages);
  if (inappropriate) {
    return new Response(JSON.stringify({
      error: 'Content blocked',
      reason: 'Inappropriate content detected'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Forward to DeepSeek API
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: body.options?.model || 'deepseek-chat',
        messages: body.messages,
        temperature: Math.min(body.options?.temperature || 0.7, 0.9),
        top_p: body.options?.top_p || 0.95,
        max_tokens: Math.min(body.options?.max_tokens || 1000, 2000)
      })
    });

    const data = await response.json();

    // Filter response
    if (data.choices?.[0]?.message?.content) {
      const filtered = checkInappropriateContent([data.choices[0].message]);
      if (filtered) {
        data.choices[0].message.content = "I cannot provide that information. Let's focus on homework and learning!";
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('DeepSeek API error:', error);
    return new Response(JSON.stringify({
      error: 'AI service temporarily unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Database proxy handler (connects to local DB via tunnel)
async function handleDatabaseProxy(request, env) {
  const url = new URL(request.url);
  const query = url.pathname.replace('/api/db/', '');

  // For development, this connects to local SQLite via tunnel
  // In production, can migrate to D1 or external database
  if (env.DATABASE_URL) {
    try {
      // Forward query to database tunnel endpoint
      const dbResponse = await fetch(`${env.DATABASE_URL}/${query}`, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? await request.text() : undefined
      });

      return new Response(await dbResponse.text(), {
        status: dbResponse.status,
        headers: dbResponse.headers
      });
    } catch (error) {
      console.error('Database proxy error:', error);
      return new Response(JSON.stringify({ error: 'Database unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Database not configured' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Stats handler
async function handleStats(request, env) {
  const url = new URL(request.url);
  const token = url.pathname.split('/').pop();

  if (env.CACHE) {
    const session = await env.CACHE.get(`session:${token}`);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionData = JSON.parse(session);
    return new Response(JSON.stringify({
      sessionAge: Math.floor((Date.now() - sessionData.createdAt) / 1000 / 60),
      requestCount: sessionData.requestCount || 0,
      dailyUsage: sessionData.dailyUsage || 0
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Stats unavailable' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Content filtering function
function checkInappropriateContent(messages) {
  const inappropriatePatterns = [
    /\b(violence|violent|kill|death|die|dead|suicide|drug|alcohol|sex|nude|porn)\b/gi,
    /\b(hate|racist|discrimination)\b/gi,
    /\b(damn|hell|shit|fuck|ass|bitch)\b/gi
  ];

  for (const message of messages) {
    if (message.content) {
      for (const pattern of inappropriatePatterns) {
        if (pattern.test(message.content)) {
          return true;
        }
      }
    }
  }

  return false;
}

// Durable Object for session management (optional)
export class SessionManager {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/create') {
      const sessionData = await request.json();
      await this.state.storage.put('session', sessionData);
      return new Response('Session created', { status: 201 });
    }

    if (url.pathname === '/get') {
      const session = await this.state.storage.get('session');
      return new Response(JSON.stringify(session), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}