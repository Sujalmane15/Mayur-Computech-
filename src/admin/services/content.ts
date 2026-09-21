import { createSupabaseClient } from '../../admin/services/auth';

export type ContentRecord = Record<string, any>;

export async function getTableClient() {
  const client = createSupabaseClient();

  if (!client) {
    throw new Error('Supabase configuration is missing. Add the project URL and anon key to the admin config.');
  }

  return client;
}

export async function fetchTableRecords(
  table: string,
  select: string,
  options: {
    search?: string;
    searchField?: string;
    status?: string;
    visibility?: string;
    category?: string;
    orderBy?: string;
    ascending?: boolean;
  } = {},
) {
  const client = await getTableClient();
  let query = client.from(table).select(select);

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.visibility) {
    query = query.eq('visibility', options.visibility);
  }

  if (options.category) {
    query = query.eq('category', options.category);
  }

  if (options.search && options.searchField) {
    query = query.ilike(options.searchField, `%${options.search.trim()}%`);
  }

  const orderBy = options.orderBy ?? 'sort_order';
  const ascending = options.ascending ?? true;
  query = query.order(orderBy, { ascending }).order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as ContentRecord[];
}

export async function insertTableRecord(table: string, values: ContentRecord) {
  const client = await getTableClient();
  const { data, error } = await client.from(table).insert(values).select().single();

  if (error) {
    throw error;
  }

  return data as ContentRecord;
}

export async function updateTableRecord(table: string, id: string, values: ContentRecord) {
  const client = await getTableClient();
  const { data, error } = await client.from(table).update(values).eq('id', id).select().single();

  if (error) {
    throw error;
  }

  return data as ContentRecord;
}

export async function deleteTableRecord(table: string, id: string) {
  const client = await getTableClient();
  const { error } = await client.from(table).delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function appendAuditEntry(
  table: string,
  action: string,
  entityId: string | null,
  details: Record<string, any> = {},
) {
  const client = await getTableClient();
  const { data } = await client.auth.getUser();
  const currentUser = data.user;

  await client.from('audit_logs').insert({
    actor_id: currentUser?.id ?? null,
    actor_role: null,
    action,
    entity_type: table,
    entity_id: entityId,
    details,
  });

  return dataOrNull(currentUser);
}

export async function reorderContentRecords(
  table: string,
  items: ContentRecord[],
  itemId: string,
  direction: 'up' | 'down',
) {
  const currentIndex = items.findIndex((item) => item.id === itemId);

  if (currentIndex === -1) {
    return;
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  const targetItem = items[targetIndex];

  if (!targetItem) {
    return;
  }

  const currentItem = items[currentIndex];
  const client = await getTableClient();

  const updateCurrent = await client.from(table).update({ sort_order: targetItem.sort_order ?? 0 }).eq('id', itemId);
  const updateTarget = await client.from(table).update({ sort_order: currentItem.sort_order ?? 0 }).eq('id', targetItem.id);

  if (updateCurrent.error) {
    throw updateCurrent.error;
  }

  if (updateTarget.error) {
    throw updateTarget.error;
  }
}

export async function toggleVisibilityRecord(
  table: string,
  item: ContentRecord,
  nextVisibility?: 'public' | 'hidden',
) {
  const client = await getTableClient();
  const visibility = nextVisibility ?? (item.visibility === 'public' ? 'hidden' : 'public');
  const payload: ContentRecord = {
    visibility,
    status: visibility === 'public' ? 'published' : 'draft',
  };

  const { data, error } = await client.from(table).update(payload).eq('id', item.id).select().single();

  if (error) {
    throw error;
  }

  return data as ContentRecord;
}

export async function secureUploadToImageKit(file: File, folder = 'gallery') {
  const client = await getTableClient();
  const { data: sessionData } = await client.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    throw new Error('You must be signed in to upload media.');
  }

  const supabaseUrl =
    (typeof window !== 'undefined' && window.MAYUR_GALLERY_CONFIG?.supabaseUrl) ||
    (typeof import.meta.env.VITE_SUPABASE_URL === 'string' ? import.meta.env.VITE_SUPABASE_URL : '');
  const supabaseAnonKey =
    (typeof window !== 'undefined' && window.MAYUR_GALLERY_CONFIG?.supabaseAnonKey) ||
    (typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string' ? import.meta.env.VITE_SUPABASE_ANON_KEY : '');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing.');
  }

  const form = new FormData();
  form.append('file', file);

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/imagekit-upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
    },
    body: form,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'ImageKit upload failed.');
  }

  return {
    image_url: payload.imageUrl,
    image_path: payload.imagePath,
    image_file_id: payload.imageFileId,
    thumbnail_url: payload.thumbnailUrl ?? payload.imageUrl,
    url: payload.imageUrl,
    file_name: file.name,
    mime_type: file.type || 'application/octet-stream',
    file_size: file.size,
    category: folder,
    folder,
  };
}

export async function secureDeleteFromImageKit(fileId: string) {
  if (!fileId) {
    return;
  }

  const client = await getTableClient();
  const { data: sessionData } = await client.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    throw new Error('You must be signed in to delete media.');
  }

  const supabaseUrl =
    (typeof window !== 'undefined' && window.MAYUR_GALLERY_CONFIG?.supabaseUrl) ||
    (typeof import.meta.env.VITE_SUPABASE_URL === 'string' ? import.meta.env.VITE_SUPABASE_URL : '');
  const supabaseAnonKey =
    (typeof window !== 'undefined' && window.MAYUR_GALLERY_CONFIG?.supabaseAnonKey) ||
    (typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string' ? import.meta.env.VITE_SUPABASE_ANON_KEY : '');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing.');
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/imagekit-delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok && payload.error) {
    throw new Error(payload.error || 'ImageKit deletion failed.');
  }
}

function dataOrNull<T>(item: T | null | undefined): T | null {
  return item ?? null;
}
