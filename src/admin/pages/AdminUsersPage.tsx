import { AlertTriangle, CheckCircle2, Search, ShieldCheck, UserRound, UserX } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { fetchAdminRoles, fetchAdminUsers, updateAdminUserRole, updateAdminUserStatus, upsertAdminUser } from '../services/adminManagement';

type FormState = {
  user_id: string;
  display_name: string;
  email: string;
  role_id: string;
  status: 'active' | 'inactive' | 'suspended';
};

const emptyForm = (): FormState => ({
  user_id: '',
  display_name: '',
  email: '',
  role_id: '',
  status: 'active',
});

export function AdminUsersPage() {
  const { currentUser, isSuperAdmin } = useAdminContext();
  const [roles, setRoles] = useState<{ id: string; role_name: string; label: string }[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roleResults, userResults] = await Promise.all([fetchAdminRoles(), fetchAdminUsers()]);
      setRoles(roleResults.map((role) => ({ id: role.id, role_name: role.role_name, label: role.label })));
      setUsers(userResults);
      if (!form.role_id && roleResults[0]) {
        setForm((current) => ({ ...current, role_id: roleResults[0].id }));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load admin users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    void loadData();
  }, [isSuperAdmin]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !term || [user.display_name, user.email, user.role_name].filter(Boolean).join(' ').toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role_id === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, roleFilter, search, statusFilter]);

  const activeSuperAdmins = users.filter((user) => user.status === 'active' && user.role_name === 'SUPER_ADMIN').length;
  const selfUserId = currentUser?.id ?? '';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!form.user_id.trim()) {
        throw new Error('Provide the Supabase auth user ID for the administrator account.');
      }
      if (!form.role_id) {
        throw new Error('Select a role before linking the administrator.');
      }

      await upsertAdminUser({
        user_id: form.user_id.trim(),
        role_id: form.role_id,
        display_name: form.display_name.trim() || form.email.trim() || null,
        email: form.email.trim() || null,
        status: form.status,
      });

      setSuccess('Administrator access linked successfully.');
      setForm(emptyForm());
      if (roles[0]) {
        setForm((current) => ({ ...current, role_id: roles[0].id }));
      }
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'This administrator could not be updated.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (user: any, nextStatus: 'active' | 'inactive' | 'suspended') => {
    if (user.user_id === selfUserId) {
      setError('You cannot change your own administrator access in this screen.');
      return;
    }

    if (user.role_name === 'SUPER_ADMIN' && user.status === 'active' && nextStatus !== 'active' && activeSuperAdmins <= 1) {
      setError('At least one active Super Admin must remain.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await updateAdminUserStatus(user.user_id, nextStatus);
      setSuccess('Administrator status updated.');
      await loadData();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update administrator status.');
    }
  };

  const handleRoleChange = async (user: any, nextRoleId: string) => {
    if (user.user_id === selfUserId) {
      setError('You cannot change your own role from this screen.');
      return;
    }

    const nextRole = roles.find((role) => role.id === nextRoleId);
    if (user.role_name === 'SUPER_ADMIN' && nextRole?.role_name !== 'SUPER_ADMIN' && activeSuperAdmins <= 1) {
      setError('At least one active Super Admin must remain.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await updateAdminUserRole(user.user_id, nextRoleId);
      setSuccess('Administrator role updated.');
      await loadData();
    } catch (roleError) {
      setError(roleError instanceof Error ? roleError.message : 'This administrator role could not be updated.');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="admin-page empty-panel">
        <div className="panel-block">
          <h2>Access restricted</h2>
          <p>You do not have permission to view administrator management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page wide-layout">
      <div className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Admin Users</h1>
          <p className="muted">Link existing Supabase auth accounts to the CMS and manage their access safely.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}
      {success ? <div className="alert-box success-box">{success}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search administrators" />
        </label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="all">All roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
      </div>

      <div className="main-content-grid">
        <form className="panel-block admin-form" onSubmit={handleSubmit}>
          <div className="form-header-row">
            <div>
              <p className="eyebrow">Create</p>
              <h2>Link administrator</h2>
            </div>
            <span className="status-badge neutral"><ShieldCheck size={13} /> Existing auth user</span>
          </div>

          <label className="admin-form-row">
            <span>Supabase user ID</span>
            <input value={form.user_id} onChange={(event) => setForm((current) => ({ ...current, user_id: event.target.value }))} placeholder="UUID from auth.users" />
          </label>

          <label className="admin-form-row">
            <span>Display name</span>
            <input value={form.display_name} onChange={(event) => setForm((current) => ({ ...current, display_name: event.target.value }))} placeholder="Administrator name" />
          </label>

          <label className="admin-form-row">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="administrator@example.com" />
          </label>

          <label className="admin-form-row">
            <span>Role</span>
            <select value={form.role_id} onChange={(event) => setForm((current) => ({ ...current, role_id: event.target.value }))}>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
          </label>

          <label className="admin-form-row">
            <span>Status</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as FormState['status'] }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>

          <div className="inline-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Linking...' : 'Link account'}
            </button>
          </div>
        </form>

        <div className="panel-block table-panel">
          {loading ? <div className="admin-loading-indicator">Loading administrator records…</div> : null}
          {!loading && filteredUsers.length === 0 ? (
            <div className="empty-state-box">
              <UserRound size={24} />
              <h3>No administrators match this filter.</h3>
              <p>Link an existing Supabase auth user to begin managing CMS access.</p>
            </div>
          ) : null}
          {!loading && filteredUsers.length > 0 ? (
            <div className="table-wrap">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.display_name || 'Unnamed admin'}</td>
                      <td>{user.email || 'No email'}</td>
                      <td>{user.role_label || user.role_name || 'Unassigned'}</td>
                      <td>
                        <span className={`status-badge ${user.status === 'active' ? 'success' : user.status === 'inactive' ? 'muted' : 'warning'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="inline-actions compact-actions">
                          <select value={user.role_id ?? ''} onChange={(event) => void handleRoleChange(user, event.target.value)} disabled={user.user_id === selfUserId || user.role_name === 'SUPER_ADMIN' && activeSuperAdmins <= 1}>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>{role.label}</option>
                            ))}
                          </select>
                          {user.status === 'active' ? (
                            <button type="button" className="secondary-button small-button" onClick={() => void handleStatusChange(user, 'inactive')} disabled={user.user_id === selfUserId || user.role_name === 'SUPER_ADMIN' && activeSuperAdmins <= 1}>
                              <UserX size={14} /> Inactive
                            </button>
                          ) : (
                            <button type="button" className="secondary-button small-button" onClick={() => void handleStatusChange(user, 'active')} disabled={user.user_id === selfUserId}>
                              <CheckCircle2 size={14} /> Active
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>

      {activeSuperAdmins <= 0 ? (
        <div className="panel-block alert-box error-box">
          <AlertTriangle size={16} /> At least one active Super Admin must remain to protect the CMS.
        </div>
      ) : null}
    </div>
  );
}
