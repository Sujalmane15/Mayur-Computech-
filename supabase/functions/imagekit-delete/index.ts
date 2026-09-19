import { corsHeaders } from '../_shared/cors.ts';
import { requireAdmin } from '../_shared/auth.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    await requireAdmin(request);
    const { fileId } = await request.json();
    if (!fileId || typeof fileId !== 'string') {
      return new Response(JSON.stringify({ error: 'Image file id is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const privateKey = Deno.env.get('IMAGEKIT_PRIVATE_KEY');
    if (!privateKey) return new Response(JSON.stringify({ error: 'Image storage is not configured' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Basic ${btoa(`${privateKey}:`)}` },
    });
    if (!response.ok && response.status !== 404) return new Response(JSON.stringify({ error: 'ImageKit delete failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    return new Response(JSON.stringify({ error: message }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});