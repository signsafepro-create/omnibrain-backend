export interface Env {
  BACKEND_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Standard CORS headers for cross-origin frontend communication
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      "Content-Type": "application/json; charset=utf-8"
    };

    // Handle CORS preflight OPTIONS requests immediately
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // 1. Edge Health & Observability Check
      if (url.pathname === "/health" || url.pathname === "/api/v1/health") {
        return new Response(
          JSON.stringify({
            status: "healthy",
            edgeWorker: "cloudflare-pages-router",
            datacenter: request.cf?.colo || "EDGE",
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      // 2. Route proxies to backend origin if BACKEND_URL configured
      if (env.BACKEND_URL && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/") || url.pathname.startsWith("/predict/") || url.pathname.startsWith("/webhooks/"))) {
        const backendOrigin = env.BACKEND_URL.replace(/\/$/, "");
        const targetUrl = `${backendOrigin}${url.pathname}${url.search}`;
        const modifiedRequest = new Request(targetUrl, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });

        const backendResponse = await fetch(modifiedRequest);
        const newHeaders = new Headers(backendResponse.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));

        return new Response(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: newHeaders
        });
      }

      // 3. Command Center Fallback Response
      return new Response(
        JSON.stringify({
          success: true,
          message: "LILJR Sovereign Stack Edge Router Active",
          domain: url.hostname,
          path: url.pathname,
          timestamp: new Date().toISOString()
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Edge Router Exception",
          details: err.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
