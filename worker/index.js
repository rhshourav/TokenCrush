export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const visitors = parseInt(await env.STATS.get('visitors') || '0');
      const filesCompressed = parseInt(await env.STATS.get('files_compressed') || '0');
      return Response.json({ visitors, filesCompressed }, { headers: corsHeaders });
    }

    if (url.pathname === '/api/stats/visit' && request.method === 'POST') {
      const current = parseInt(await env.STATS.get('visitors') || '0');
      const updated = current + 1;
      await env.STATS.put('visitors', String(updated));
      return Response.json({ visitors: updated }, { headers: corsHeaders });
    }

    if (url.pathname === '/api/stats/compress' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch {}
      const count = body.count || 1;
      const current = parseInt(await env.STATS.get('files_compressed') || '0');
      const updated = current + count;
      await env.STATS.put('files_compressed', String(updated));
      return Response.json({ filesCompressed: updated }, { headers: corsHeaders });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
