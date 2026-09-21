import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '../services/auth';
import { sanitizeAuditDetails } from '../services/adminManagement';

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function summarizeDetails(details: unknown) {
  const cleaned = sanitizeAuditDetails(details);
  if (!cleaned || typeof cleaned !== 'object') {
    return '—';
  }

  const text = JSON.stringify(cleaned, null, 2);
  return text.length > 220 ? `${text.slice(0, 220)}…` : text;
}

export function AuditLogsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      const client = createSupabaseClient();
      if (!client) {
        setError('Supabase configuration is missing.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: loadError } = await client
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);

        if (loadError) throw loadError;
        setRows(data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load audit logs.');
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, []);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const actorText = String(row.actor_id ?? row.actor_role ?? '').toLowerCase();
    const moduleText = String(row.entity_type ?? '').toLowerCase();
    const text = `${actorText} ${row.action ?? ''} ${moduleText} ${JSON.stringify(row.details ?? {})}`.toLowerCase();
    const matchesSearch = !search || text.includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || row.action === actionFilter;
    const matchesActor = actorFilter === 'all' || row.actor_role === actorFilter || actorText.includes(actorFilter.toLowerCase());
    const matchesDateFrom = !dateFrom || (row.created_at && row.created_at >= dateFrom);
    const matchesDateTo = !dateTo || (row.created_at && row.created_at <= `${dateTo}T23:59:59`);
    return matchesSearch && matchesAction && matchesActor && matchesDateFrom && matchesDateTo;
  }), [actionFilter, actorFilter, dateFrom, dateTo, rows, search]);

  const actionOptions = useMemo(() => Array.from(new Set(rows.map((item) => item.action).filter(Boolean))).sort(), [rows]);
  const actorOptions = useMemo(() => Array.from(new Set(rows.map((item) => item.actor_role).filter(Boolean))).sort(), [rows]);

  return (
    <div className="admin-page wide-layout">
      <div className="page-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Audit Logs</h1>
          <p className="muted">Recent system actions are shown here without exposing secrets or credentials.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search log details" />
        </label>
        <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}>
          <option value="all">All actions</option>
          {actionOptions.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
        <select value={actorFilter} onChange={(event) => setActorFilter(event.target.value)}>
          <option value="all">All actors</option>
          {actorOptions.map((actor) => (
            <option key={actor} value={actor}>{actor}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
      </div>

      <div className="panel-block">
        {loading ? (
          <div className="admin-loading-indicator">Loading audit records…</div>
        ) : filteredRows.length === 0 ? (
          <div className="empty-state-box">
            <h3>No matching audit entries</h3>
            <p>Try broadening the search or date range.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Record</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(row.created_at)}</td>
                    <td>{row.actor_role || row.actor_id || 'Unknown'}</td>
                    <td>{row.action}</td>
                    <td>{row.entity_type}</td>
                    <td>{row.entity_id || '—'}</td>
                    <td>{summarizeDetails(row.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
