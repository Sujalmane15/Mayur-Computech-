import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function requireAdmin(request: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: request.headers.get('Authorization') ?? '' } } },
  );
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Authentication required');

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (adminError || !admin) throw new Error('Administrator access required');
  return { supabase, user };
}