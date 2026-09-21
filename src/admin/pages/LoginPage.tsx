import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';

export function LoginPage() {
  const { currentUser, isLoading, signIn } = useAdminContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin/dashboard';

  if (isLoading) {
    return <div className="admin-loading">Checking access...</div>;
  }

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Unable to sign in.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="eyebrow">Mayur Computech</p>
        <h1>Admin Login</h1>
        <p className="muted">Sign in with a registered CMS administrator account.</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>

          {error ? <p className="error-box">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="primary-button">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
