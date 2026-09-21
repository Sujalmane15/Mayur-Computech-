import { useEffect, useState } from 'react';
import { Image as ImageIcon, Search, Trash2 } from 'lucide-react';
import { createSupabaseClient } from '../services/auth';

export function MediaPage() {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const loadMedia = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: mediaError } = await client.from('media_library').select('*').order('created_at', { ascending: false });
      if (mediaError) throw mediaError;
      setItems(data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load media library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const filteredItems = items.filter((item) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.title, item.file_name, item.category, item.alt_text].some((field) => String(field ?? '').toLowerCase().includes(needle));
  });

  const handleDelete = async (item: Record<string, any>) => {
    if (!window.confirm(`Delete “${item.title}” from the media library?`)) {
      return;
    }

    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      return;
    }

    try {
      const { error: deleteError } = await client.from('media_library').delete().eq('id', item.id);
      if (deleteError) throw deleteError;
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Unable to delete media.';
      setError(message);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Assets</p>
          <h1>Media library</h1>
          <p className="muted">Central catalog for reusable media.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media" />
        </label>
      </div>

      <div className="panel-block">
        {loading ? (
          <div className="admin-loading-indicator">Loading media…</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state-box">
            <ImageIcon size={28} />
            <h3>No media found</h3>
            <p>There are no files in the library yet.</p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredItems.map((item) => (
              <article key={item.id} className="media-card">
                <div className="media-preview-wrap">
                  {item.url ? <img src={item.url} alt={item.alt_text ?? item.title} className="media-preview" /> : <div className="media-placeholder">Media</div>}
                </div>
                <div className="media-card-body">
                  <strong>{item.title}</strong>
                  <small>{item.file_name}</small>
                  <p>{item.category}</p>
                  <div className="media-actions">
                    <a href={item.url} target="_blank" rel="noreferrer" className="secondary-button small-button">Preview</a>
                    <button type="button" className="danger-button small-button" onClick={() => handleDelete(item)}>
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
