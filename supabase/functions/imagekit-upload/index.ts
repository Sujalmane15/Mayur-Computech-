import { corsHeaders } from '../_shared/cors.ts';
import { requireAdmin } from '../_shared/auth.ts';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    await requireAdmin(request);
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return json({ error: 'An image file is required' }, 400);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return json({ error: 'Only JPG, PNG, and WEBP files are supported' }, 400);
    }
    if (file.size > 8 * 1024 * 1024) return json({ error: 'Image must be smaller than 8 MB' }, 400);

    const privateKey = Deno.env.get('IMAGEKIT_PRIVATE_KEY');
    const endpoint = Deno.env.get('IMAGEKIT_URL_ENDPOINT');
    if (!privateKey || !endpoint) return json({ error: 'Image storage is not configured' }, 503);

    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const payload = new FormData();
    payload.append('file', btoa(binary));
    payload.append('fileName', file.name);
    payload.append('folder', '/mayur-computech/gallery');
    payload.append('useUniqueFileName', 'true');
    payload.append('responseFields', 'fileId,filePath,url,thumbnailUrl');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`${privateKey}:`)}` },
      body: payload,
    });
    const result = await response.json();
    if (!response.ok) return json({ error: 'ImageKit upload failed' }, 502);
    return json({
      imageUrl: result.url,
      imagePath: result.filePath,
      imageFileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl ?? result.url,
      endpoint,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    const status = message.includes('required') || message.includes('Administrator') ? 401 : 500;
    return json({ error: message }, status);
  }
});