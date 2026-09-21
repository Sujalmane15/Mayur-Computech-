import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Save, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '../services/auth';
import { getDefaultSectionRecord, getWebsiteSectionSchema, isSafeWebsiteUrl, type WebsiteSectionType } from '../services/websiteSections';

type WebsiteSectionRecord = {
  id: string;
  section_key: string;
  component_type: string;
  title: string;
  content: Record<string, any>;
  settings: Record<string, any>;
  sort_order: number;
  status: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

const fieldTypeMap = {
  text: 'text',
  textarea: 'textarea',
  url: 'url',
  select: 'select',
  checkbox: 'checkbox',
  number: 'number',
} as const;

const defaultDraft = (): Record<string, any> => ({
  section_key: 'hero',
  content: {},
  status: 'draft',
  is_enabled: true,
  sort_order: 0,
  settings: {},
});

function toSafeSectionType(value: string): WebsiteSectionType {
  const matched = ['hero', 'trainer', 'trainer_carousel', 'about', 'courses', 'why_choose_us', 'gallery', 'results', 'achievements', 'testimonials', 'faq', 'contact', 'footer'].includes(value)
    ? value as WebsiteSectionType
    : 'hero';
  return matched;
}

export function WebsiteSectionsPage() {
  const [sections, setSections] = useState<WebsiteSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<WebsiteSectionType>('hero');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Record<string, any>>(defaultDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSections = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: loadError } = await client
        .from('site_sections')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;
      setSections((data ?? []) as WebsiteSectionRecord[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load website sections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSections();
  }, []);

  const filteredSections = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sections;
    return sections.filter((item) => `${item.title} ${item.section_key} ${item.component_type}`.toLowerCase().includes(term));
  }, [search, sections]);

  const openNewSection = (type: WebsiteSectionType = selectedType) => {
    const schema = getWebsiteSectionSchema(type);
    const defaultRecord = getDefaultSectionRecord(type);
    setEditingId(null);
    setSelectedType(type);
    setDraft({
      section_key: type,
      content: { ...schema.defaultValues },
      status: 'draft',
      is_enabled: true,
      sort_order: sections.length,
      settings: {},
      title: defaultRecord.title,
    });
  };

  const beginEdit = (record: WebsiteSectionRecord) => {
    const type = toSafeSectionType(record.section_key || record.component_type || selectedType);
    const schema = getWebsiteSectionSchema(type);
    setSelectedType(type);
    setEditingId(record.id);
    setDraft({
      section_key: type,
      title: record.title || schema.label,
      content: { ...(schema.defaultValues || {}), ...(record.content || {}) },
      status: record.status || 'draft',
      is_enabled: record.is_enabled,
      sort_order: record.sort_order ?? 0,
      settings: record.settings || {},
      component_type: record.component_type || type,
    });
  };

  const updateField = (key: string, value: any) => {
    setDraft((current) => ({
      ...current,
      content: {
        ...(current.content || {}),
        [key]: value,
      },
    }));
  };

  const saveSection = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      return;
    }

    const schema = getWebsiteSectionSchema(selectedType);
    const content = { ...schema.defaultValues, ...(draft.content || {}) };

    for (const field of schema.fields) {
      const value = content[field.key];
      if (field.type === 'url' && typeof value === 'string' && value.trim() && !isSafeWebsiteUrl(value)) {
        setError(`Invalid URL for ${field.label}. Only http, https, mailto, tel, or internal paths are allowed.`);
        return;
      }
    }

    const payload = {
      section_key: selectedType,
      component_type: selectedType,
      title: draft.title || schema.label,
      content,
      settings: draft.settings || {},
      status: draft.status || 'draft',
      is_enabled: draft.is_enabled !== false,
      sort_order: Number(draft.sort_order ?? 0),
      updated_by: null,
    };

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const { error: updateError } = await client.from('site_sections').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        setSuccess('Section updated successfully.');
      } else {
        const { error: insertError } = await client.from('site_sections').insert({ ...payload, created_by: null });
        if (insertError) throw insertError;
        setSuccess('Section created successfully.');
      }
      await loadSections();
      openNewSection(selectedType);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save section.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSectionVisibility = async (record: WebsiteSectionRecord) => {
    const client = createSupabaseClient();
    if (!client) return;

    try {
      const nextEnabled = !record.is_enabled;
      const { error } = await client.from('site_sections').update({ is_enabled: nextEnabled }).eq('id', record.id);
      if (error) throw error;
      setSuccess(`Section ${nextEnabled ? 'enabled' : 'disabled'} successfully.`);
      await loadSections();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update visibility.');
    }
  };

  const moveSection = async (record: WebsiteSectionRecord, direction: 'up' | 'down') => {
    const client = createSupabaseClient();
    if (!client) return;

    const index = sections.findIndex((item) => item.id === record.id);
    const target = sections[index + (direction === 'up' ? -1 : 1)];
    if (index === -1 || !target) return;

    try {
      const currentSort = record.sort_order ?? 0;
      const nextSort = target.sort_order ?? 0;
      const update1 = await client.from('site_sections').update({ sort_order: nextSort }).eq('id', record.id);
      const update2 = await client.from('site_sections').update({ sort_order: currentSort }).eq('id', target.id);
      if (update1.error) throw update1.error;
      if (update2.error) throw update2.error;
      setSuccess('Section order updated.');
      await loadSections();
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : 'Unable to reorder sections.');
    }
  };

  const schema = getWebsiteSectionSchema(selectedType);

  return (
    <div className="admin-page wide-layout">
      <div className="page-header">
        <div>
          <p className="eyebrow">Website Builder</p>
          <h1>Section Manager</h1>
          <p className="muted">Structured homepage control for the public website without enabling arbitrary code editing.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}
      {success ? <div className="alert-box success-box">{success}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sections" />
        </label>
        <select value={selectedType} onChange={(event) => openNewSection(event.target.value as WebsiteSectionType)}>
          {['hero', 'trainer', 'about', 'courses', 'why_choose_us', 'gallery', 'results', 'achievements', 'testimonials', 'faq', 'contact', 'footer'].map((sectionKey) => {
            const optionSchema = getWebsiteSectionSchema(sectionKey as WebsiteSectionType);
            return <option key={sectionKey} value={sectionKey}>{optionSchema.label}</option>;
          })}
        </select>
      </div>

      <div className="main-content-grid">
        <form className="panel-block admin-form" onSubmit={(event) => { event.preventDefault(); void saveSection(); }}>
          <div className="form-header-row">
            <div>
              <p className="eyebrow">{editingId ? 'Edit' : 'Create'}</p>
              <h2>{editingId ? `${schema.label} section` : `New ${schema.label} section`}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => openNewSection(selectedType)}>
              <Plus size={16} /> Reset
            </button>
          </div>

          <label className="admin-form-row">
            <span>Section title</span>
            <input value={draft.title ?? ''} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Section display name" />
          </label>

          <label className="admin-form-row">
            <span>Publish state</span>
            <select value={draft.status ?? 'draft'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="admin-form-row checkbox-row">
            <div><span>Visible on site</span></div>
            <input type="checkbox" checked={draft.is_enabled !== false} onChange={(event) => setDraft((current) => ({ ...current, is_enabled: event.target.checked }))} />
          </label>

          {schema.fields.map((field) => {
            const fieldValue = draft.content?.[field.key] ?? schema.defaultValues[field.key] ?? '';
            if (field.type === 'checkbox') {
              return (
                <label key={field.key} className="admin-form-row checkbox-row">
                  <div>
                    <span>{field.label}</span>
                    {field.helperText ? <small>{field.helperText}</small> : null}
                  </div>
                  <input type="checkbox" checked={Boolean(fieldValue)} onChange={(event) => updateField(field.key, event.target.checked)} />
                </label>
              );
            }

            if (field.type === 'textarea') {
              return (
                <label key={field.key} className="admin-form-row">
                  <span>{field.label}</span>
                  <textarea value={String(fieldValue ?? '')} placeholder={field.placeholder} onChange={(event) => updateField(field.key, event.target.value)} />
                </label>
              );
            }

            if (field.type === 'select') {
              return (
                <label key={field.key} className="admin-form-row">
                  <span>{field.label}</span>
                  <select value={String(fieldValue ?? '')} onChange={(event) => updateField(field.key, event.target.value)}>
                    <option value="">Select...</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              );
            }

            if (field.type === 'number') {
              return (
                <label key={field.key} className="admin-form-row">
                  <span>{field.label}</span>
                  <input type="number" value={Number(fieldValue ?? 0)} onChange={(event) => updateField(field.key, Number(event.target.value || 0))} />
                </label>
              );
            }

            return (
              <label key={field.key} className="admin-form-row">
                <span>{field.label}</span>
                <input type={fieldTypeMap[field.type ?? 'text']} value={String(fieldValue ?? '')} placeholder={field.placeholder} onChange={(event) => updateField(field.key, event.target.value)} />
              </label>
            );
          })}

          <div className="inline-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : editingId ? 'Save Section' : 'Create Section'}
            </button>
          </div>
        </form>

        <div className="panel-block table-panel">
          {loading ? <div className="admin-loading-indicator">Loading website sections…</div> : null}
          {!loading && filteredSections.length === 0 ? (
            <div className="empty-state-box">
              <ShieldCheck size={26} />
              <h3>No section configuration yet</h3>
              <p>Create a section to begin controlling the homepage.</p>
            </div>
          ) : null}

          {!loading && filteredSections.length > 0 ? (
            <div className="table-wrap">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSections.map((record) => (
                    <tr key={record.id}>
                      <td>{record.section_key}</td>
                      <td>{record.title}</td>
                      <td><span className={`status-badge ${record.status === 'published' ? 'success' : record.status === 'draft' ? 'muted' : 'warning'}`}>{record.status}</span></td>
                      <td><span className={`status-badge ${record.is_enabled ? 'success' : 'warning'}`}>{record.is_enabled ? 'Visible' : 'Hidden'}</span></td>
                      <td>{record.sort_order}</td>
                      <td>
                        <div className="inline-actions compact-actions">
                          <button type="button" className="secondary-button small-button" onClick={() => beginEdit(record)}>
                            <Pencil size={14} /> Edit
                          </button>
                          <button type="button" className="secondary-button small-button" onClick={() => toggleSectionVisibility(record)}>
                            {record.is_enabled ? <EyeOff size={14} /> : <Eye size={14} />}
                            {record.is_enabled ? 'Hide' : 'Show'}
                          </button>
                          <button type="button" className="secondary-button small-button" onClick={() => moveSection(record, 'up')}>
                            <ArrowUp size={14} />
                          </button>
                          <button type="button" className="secondary-button small-button" onClick={() => moveSection(record, 'down')}>
                            <ArrowDown size={14} />
                          </button>
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
    </div>
  );
}
