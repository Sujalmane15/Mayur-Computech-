import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="admin-empty-state">
      <h1>Access Denied</h1>
      <p>You do not have permission to access this area.</p>
      <Link to="/admin/dashboard" className="primary-button">Return to Dashboard</Link>
    </div>
  );
}
