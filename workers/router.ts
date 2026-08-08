export interface Env {
  BACKEND_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Standard CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
      "Content-Type": "application/json; charset=utf-8"
    };

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Health check routing
      if (url.pathname === "/health" || url.pathname === "/api/v1/health") {
        return new Response(
          JSON.stringify({
            status: "healthy",
            edgeWorker: "cloudflare-pages-router",
            timestamp: new Date().toISOString()
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      // 2. Route proxies to backend origin if BACKEND_URL configured
      if (env.BACKEND_URL && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/") || url.pathname.startsWith("/predict/"))) {
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

      // 3. Fallback edge JSON response
      return new Response(
        JSON.stringify({
          success: true,
          message: "LILJR Sovereign Stack Edge Worker Active",
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
