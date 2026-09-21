import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminContext } from '../context/AdminContext';
import { ADMIN_SIDEBAR_ITEMS } from '../services/permissions';

const navLabelMap: Record<string, string> = {
  SUPER_ADMIN: 'SUPER ADMIN',
  CLIENT_ADMIN: 'CLIENT ADMIN',
};

function buildVisibleItems(permissions: string[]) {
  return ADMIN_SIDEBAR_ITEMS.filter((item) => {
    if ('children' in item) {
      const visibleChildren = item.children.filter((child) => permissions.includes(child.permission));
      return visibleChildren.length > 0;
    }

    return permissions.includes(item.permission);
  }).map((item) => {
    if ('children' in item) {
      return {
        ...item,
        children: item.children.filter((child) => permissions.includes(child.permission)),
      };
    }

    return item;
  });
}

export function AdminLayout() {
  const { role, permissions, currentUser, signOut } = useAdminContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = useMemo(() => buildVisibleItems(permissions), [permissions]);

  return (
    <div className="admin-app-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="brand-mark"><ShieldCheck size={18} /></div>
          <div>
            <p className="eyebrow">Mayur Computech</p>
            <h1>Admin</h1>
          </div>
        </div>

        <nav className="admin-nav">
          {visibleItems.map((item) => {
            if ('children' in item) {
              return (
                <div key={item.label} className="nav-group">
                  <p className="nav-group-title">{item.label}</p>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main-panel">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="mobile-menu-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle navigation">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="eyebrow">Operations</p>
              <h2>Admin Console</h2>
            </div>
          </div>

          <div className="admin-user-menu">
            <div className="user-details">
              <span className="user-name">{currentUser?.email ?? 'Administrator'}</span>
              <span className="user-role">{navLabelMap[role ?? ''] ?? 'ADMIN'}</span>
            </div>
            <button type="button" className="logout-button" onClick={() => void signOut()}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
