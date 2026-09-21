import { ArrowRight, Layers3, PencilLine, Settings2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '../services/auth';
import { WEBSITE_SECTION_TYPES } from '../services/websiteSections';

type SectionSummary = {
  id: string;
  section_key: string;
  is_enabled: boolean;
  status: string;
  sort_order: number;
};

export function WebsiteDashboardPage() {
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSections = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: sectionError } = await client
        .from('site_sections')
        .select('id, section_key, is_enabled, status, sort_order')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (sectionError) throw sectionError;
      setSections((data ?? []) as SectionSummary[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load website sections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSections();
  }, []);

  const enabledCount = useMemo(() => sections.filter((section) => section.is_enabled).length, [sections]);
  const disabledCount = useMemo(() => sections.filter((section) => !section.is_enabled).length, [sections]);
  const draftCount = useMemo(() => sections.filter((section) => section.status === 'draft').length, [sections]);
  const publishedCount = useMemo(() => sections.filter((section) => section.status === 'published').length, [sections]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Website</p>
          <h1>Website Dashboard</h1>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}

      <div className="dashboard-grid">
        <div className="stat-card">
          <p>Website status</p>
          <strong>{loading ? 'Loading…' : 'Active'}</strong>
        </div>
        <div className="stat-card">
          <p>Section count</p>
          <strong>{sections.length}</strong>
        </div>
        <div className="stat-card">
          <p>Enabled</p>
          <strong>{enabledCount}</strong>
        </div>
        <div className="stat-card">
          <p>Disabled</p>
          <strong>{disabledCount}</strong>
        </div>
        <div className="stat-card">
          <p>Draft</p>
          <strong>{draftCount}</strong>
        </div>
        <div className="stat-card">
          <p>Published</p>
          <strong>{publishedCount}</strong>
        </div>
      </div>

      <div className="panel-block">
        <h2>Quick actions</h2>
        <div className="tag-list">
          <Link className="tag-item" to="/admin/website/sections"><Layers3 size={14} /> Sections</Link>
          <Link className="tag-item" to="/admin/website/settings"><Settings2 size={14} /> Settings</Link>
          <Link className="tag-item" to="/admin/website/seo"><ShieldCheck size={14} /> SEO</Link>
        </div>
      </div>

      <div className="panel-block">
        <h2>Section coverage</h2>
        <div className="tag-list">
          {WEBSITE_SECTION_TYPES.map((section) => {
            const exists = sections.some((item) => item.section_key === section.value);
            return (
              <span key={section.value} className={`tag-item ${exists ? 'success' : 'muted'}`}>
                {section.label}
                <ArrowRight size={12} />
                {exists ? 'Ready' : 'Pending'}
              </span>
            );
          })}
        </div>
      </div>

      <div className="panel-block">
        <h2>Recent website configuration</h2>
        {loading ? (
          <p className="muted">Loading section state…</p>
        ) : sections.length === 0 ? (
          <p className="muted">No sections have been created yet. Create the homepage structure from the Sections page.</p>
        ) : (
          <div className="table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Order</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.id}>
                    <td>{section.section_key}</td>
                    <td><span className={`status-badge ${section.status === 'published' ? 'success' : section.status === 'draft' ? 'muted' : 'warning'}`}>{section.status}</span></td>
                    <td><span className={`status-badge ${section.is_enabled ? 'success' : 'warning'}`}>{section.is_enabled ? 'Visible' : 'Hidden'}</span></td>
                    <td>{section.sort_order}</td>
                    <td>
                      <Link to="/admin/website/sections" className="secondary-button small-button">
                        <PencilLine size={14} /> Edit
                      </Link>
                    </td>
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
