import { createSupabaseClient } from './auth';

export type AdminRoleRecord = {
  id: string;
  role_name: string;
  label: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminPermissionRecord = {
  id: string;
  code: string;
  module: string;
  label: string;
  description: string | null;
  created_at: string;
};

export type AdminUserRecord = {
  user_id: string;
  role_id: string | null;
  display_name: string | null;
  email: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_active_at: string | null;
  role_name?: string;
  role_label?: string;
};

async function getAdminClient() {
  const client = createSupabaseClient();
  if (!client) {
    throw new Error('Supabase configuration is missing.');
  }
  return client;
}

export async function fetchAdminRoles(): Promise<AdminRoleRecord[]> {
  const client = await getAdminClient();
  const { data, error } = await client.from('admin_roles').select('*').order('role_name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminRoleRecord[];
}

export async function fetchAdminPermissions(): Promise<AdminPermissionRecord[]> {
  const client = await getAdminClient();
  const { data, error } = await client.from('admin_permissions').select('*').order('module', { ascending: true }).order('code', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminPermissionRecord[];
}

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  const client = await getAdminClient();
  const [adminUsersResult, rolesResult] = await Promise.all([
    client.from('admin_users').select('*').order('created_at', { ascending: false }),
    client.from('admin_roles').select('*'),
  ]);

  if (adminUsersResult.error) {
    throw adminUsersResult.error;
  }

  if (rolesResult.error) {
    throw rolesResult.error;
  }

  const roleById = new Map((rolesResult.data ?? []).map((role) => [role.id, role]));

  return ((adminUsersResult.data ?? []) as AdminUserRecord[]).map((user) => {
    const role = roleById.get(user.role_id ?? '');
    return {
      ...user,
      role_name: role?.role_name ?? null,
      role_label: role?.label ?? null,
    };
  });
}

export async function fetchRolePermissionIds(roleId: string): Promise<string[]> {
  const client = await getAdminClient();
  const { data, error } = await client.from('role_permissions').select('permission_id').eq('role_id', roleId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((entry) => String(entry.permission_id)).filter(Boolean);
}

export async function upsertAdminUser(payload: {
  user_id: string;
  role_id: string;
  display_name?: string | null;
  email?: string | null;
  status?: string;
}) {
  const client = await getAdminClient();
  const { data, error } = await client
    .from('admin_users')
    .upsert(
      {
        user_id: payload.user_id,
        role_id: payload.role_id,
        display_name: payload.display_name ?? null,
        email: payload.email ?? null,
        status: payload.status ?? 'active',
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAdminUserRole(userId: string, roleId: string) {
  const client = await getAdminClient();
  const { data, error } = await client.from('admin_users').update({ role_id: roleId }).eq('user_id', userId).select().single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateAdminUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
  const client = await getAdminClient();
  const { data, error } = await client.from('admin_users').update({ status }).eq('user_id', userId).select().single();

  if (error) {
    throw error;
  }

  return data;
}

export function sanitizeAuditDetails(value: unknown): unknown {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditDetails(item));
  }

  const cleaned: Record<string, any> = {};
  for (const [key, itemValue] of Object.entries(value)) {
    if (/password|token|secret|private|key/i.test(key)) {
      continue;
    }
    cleaned[key] = sanitizeAuditDetails(itemValue);
  }

  return cleaned;
}
