import { Search, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { fetchAdminPermissions, fetchAdminRoles, fetchRolePermissionIds } from '../services/adminManagement';

export function PermissionsPage() {
  const { isSuperAdmin } = useAdminContext();
  const [roles, setRoles] = useState<{ id: string; role_name: string; label: string }[]>([]);
  const [permissions, setPermissions] = useState<{ id: string; code: string; module: string; label: string; description: string | null }[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, Set<string>>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isSuperAdmin) {
        setLoading(false);
        return;
      }

      try {
        const [roleResults, permissionResults] = await Promise.all([fetchAdminRoles(), fetchAdminPermissions()]);
        const roleById = roleResults.map((role) => ({ id: role.id, role_name: role.role_name, label: role.label }));
        setRoles(roleById);
        setPermissions(permissionResults);

        const assignment: Record<string, Set<string>> = {};
        for (const role of roleById) {
          const ids = await fetchRolePermissionIds(role.id);
          assignment[role.id] = new Set(ids);
        }
        setRolePermissions(assignment);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [isSuperAdmin]);

  const filteredPermissions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return permissions;
    }

    return permissions.filter((permission) => `${permission.label} ${permission.code} ${permission.module}`.toLowerCase().includes(term));
  }, [permissions, search]);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, typeof permissions>();

    filteredPermissions.forEach((permission) => {
      const group = groups.get(permission.module) ?? [];
      group.push(permission);
      groups.set(permission.module, group);
    });

    return [...groups.entries()].sort(([first], [second]) => first.localeCompare(second));
  }, [filteredPermissions]);

  if (!isSuperAdmin) {
    return (
      <div className="admin-page empty-panel">
        <div className="panel-block">
          <h2>Access restricted</h2>
          <p>You do not have permission to view the permission matrix.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page wide-layout">
      <div className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Permissions</h1>
          <p className="muted">Live RBAC assignments are displayed here. Permission edits are kept in the database layer and guarded by super-admin policies.</p>
        </div>
      </div>

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permission" />
        </label>
      </div>

      {loading ? (
        <div className="panel-block admin-loading-indicator">Loading permission matrix…</div>
      ) : (
        <div className="panel-block">
          <div className="table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Permission</th>
                  <th>Description</th>
                  {roles.map((role) => (
                    <th key={role.id}>{role.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedPermissions.map(([groupName, groupPermissions]) => (
                  <>
                    <tr key={`${groupName}-header`}>
                      <td colSpan={3 + roles.length}><strong>{groupName}</strong></td>
                    </tr>
                    {groupPermissions.map((permission) => (
                      <tr key={permission.id}>
                        <td>{permission.module}</td>
                        <td>{permission.label}</td>
                        <td>{permission.description || '—'}</td>
                        {roles.map((role) => (
                          <td key={`${role.id}-${permission.id}`}>
                            {rolePermissions[role.id]?.has(permission.id) ? (
                              <span className="status-badge success"><ShieldCheck size={12} /> Granted</span>
                            ) : (
                              <span className="status-badge muted">No</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
