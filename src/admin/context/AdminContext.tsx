import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createSupabaseClient, getCurrentUser, signInWithPassword, signOutUser } from '../services/auth';
import { hasPermission as checkPermission, hasRole as checkRole } from '../services/permissions';

type AdminUser = {
  user_id: string;
  role_id: string | null;
  display_name: string | null;
  email: string | null;
  status: 'active' | 'inactive' | 'suspended' | string;
};

type AdminContextValue = {
  currentUser: { id: string; email?: string | null } | null;
  adminUser: AdminUser | null;
  role: string | null;
  permissions: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isClientAdmin: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  refreshAdminState: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const resetAdminState = useCallback(() => {
    setCurrentUser(null);
    setAdminUser(null);
    setRole(null);
    setPermissions([]);
  }, []);

  const hydratePermissions = useCallback(async (userId: string, adminRecord: AdminUser) => {
    const client = createSupabaseClient();

    if (!client) {
      setRole(null);
      setPermissions([]);
      return;
    }

    let resolvedRoleName: string | null = null;

    if (adminRecord.role_id) {
      const { data: roleRecord } = await client
        .from('admin_roles')
        .select('role_name')
        .eq('id', adminRecord.role_id)
        .maybeSingle();

      resolvedRoleName = roleRecord?.role_name ?? null;
    }

    setRole(resolvedRoleName);

    if (!adminRecord.role_id) {
      setPermissions([]);
      return;
    }

    const { data: rolePermissions } = await client
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', adminRecord.role_id);

    const permissionIds = (rolePermissions ?? []).map((entry) => entry.permission_id).filter(Boolean) as string[];

    if (!permissionIds.length) {
      setPermissions([]);
      return;
    }

    const { data: rows } = await client
      .from('admin_permissions')
      .select('code')
      .in('id', permissionIds);

    setPermissions((rows ?? []).map((entry) => entry.code).filter(Boolean) as string[]);
  }, []);

  const refreshAdminState = useCallback(async () => {
    const client = createSupabaseClient();
    if (!client) {
      resetAdminState();
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const { data: sessionData } = await client.auth.getSession();
    const user = sessionData.session?.user ?? null;

    if (!user) {
      resetAdminState();
      setIsLoading(false);
      return;
    }

    const activeUser = {
      id: user.id,
      email: user.email,
    };

    setCurrentUser(activeUser);

    const { data: adminRecord } = await client
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminRecord) {
      setAdminUser(null);
      setRole(null);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    if (adminRecord.status !== 'active') {
      setAdminUser(adminRecord as AdminUser);
      setRole(null);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    setAdminUser(adminRecord as AdminUser);
    await hydratePermissions(user.id, adminRecord as AdminUser);
    setIsLoading(false);
  }, [hydratePermissions, resetAdminState]);

  useEffect(() => {
    void refreshAdminState();

    const client = createSupabaseClient();
    if (!client) {
      setIsLoading(false);
      return undefined;
    }

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        resetAdminState();
        setIsLoading(false);
        return;
      }

      setCurrentUser({ id: session.user.id, email: session.user.email });
      void refreshAdminState();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refreshAdminState, resetAdminState]);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = createSupabaseClient();
    if (!client) {
      throw new Error('Supabase configuration is missing.');
    }

    const { error } = await signInWithPassword(client, email, password);
    if (error) {
      throw error;
    }

    const user = await getCurrentUser(client);
    if (!user) {
      throw new Error('No valid session was created.');
    }

    setCurrentUser({ id: user.id, email: user.email });
    const { data: adminRecord } = await client.from('admin_users').select('*').eq('user_id', user.id).maybeSingle();

    if (!adminRecord) {
      throw new Error('This account is not registered as a CMS administrator.');
    }

    if (adminRecord.status !== 'active') {
      throw new Error('This administrator account is inactive. Contact a Super Admin to reactivate it.');
    }

    setAdminUser(adminRecord as AdminUser);
    await hydratePermissions(user.id, adminRecord as AdminUser);
  }, [hydratePermissions]);

  const signOut = useCallback(async () => {
    const client = createSupabaseClient();
    await signOutUser(client);
    resetAdminState();
    setIsLoading(false);
  }, [resetAdminState]);

  const value = useMemo<AdminContextValue>(() => ({
    currentUser,
    adminUser,
    role,
    permissions,
    isLoading,
    isAuthenticated: Boolean(currentUser),
    isSuperAdmin: checkRole(role, 'SUPER_ADMIN'),
    isClientAdmin: checkRole(role, 'CLIENT_ADMIN'),
    hasPermission: (permissionCode: string) => checkPermission(permissions, permissionCode),
    hasRole: (roleName: string) => checkRole(role, roleName),
    refreshAdminState,
    signIn,
    signOut,
  }), [adminUser, currentUser, isLoading, permissions, refreshAdminState, role, signIn, signOut]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }

  return context;
}
