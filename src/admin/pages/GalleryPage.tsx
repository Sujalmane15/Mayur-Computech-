import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Search, Trash2 } from 'lucide-react';
import { createSupabaseClient } from '../services/auth';

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  alt_text: string;
  image_url: string;
  image_path: string;
  thumbnail_url?: string;
  category: string;
  category_label: string;
  display_order: number;
  is_published: boolean;
};

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [error, setError] = useState('');

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category).filter(Boolean));
    return Array.from(unique).sort();
  }, [items]);

  const loadItems = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: galleryError } = await client
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (galleryError) throw galleryError;
      setItems((data ?? []) as GalleryItem[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const haystack = `${item.title} ${item.description} ${item.category_label} ${item.alt_text}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleToggle = async (item: GalleryItem) => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      return;
    }

    try {
      const { error: toggleError } = await client.from('gallery_items').update({ is_published: !item.is_published }).eq('id', item.id);
      if (toggleError) throw toggleError;
      await loadItems();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update gallery item.');
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;

    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      return;
    }

    try {
      const { error: deleteError } = await client.from('gallery_items').delete().eq('id', item.id);
      if (deleteError) throw deleteError;
      await loadItems();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete gallery item.');
    }
  };

  const handleReorder = async (item: GalleryItem, direction: 'up' | 'down') => {
    const index = items.findIndex((candidate) => candidate.id === item.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const target = items[targetIndex];
    if (index === -1 || !target) return;

    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      return;
    }

    try {
      const currentOrder = item.display_order;
      const nextOrder = target.display_order;
      const update1 = await client.from('gallery_items').update({ display_order: nextOrder }).eq('id', item.id);
      const update2 = await client.from('gallery_items').update({ display_order: currentOrder }).eq('id', target.id);
      if (update1.error) throw update1.error;
      if (update2.error) throw update2.error;
      await loadItems();
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : 'Unable to reorder gallery item.');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gallery</p>
          <h1>CMS gallery</h1>
          <p className="muted">Existing gallery records remain intact while the new admin shell integrates with the current ImageKit flow.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search gallery" />
        </label>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="panel-block">
        {loading ? (
          <div className="admin-loading-indicator">Loading gallery…</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state-box">
            <h3>No gallery items</h3>
            <p>There are no gallery uploads yet.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {paginatedItems.map((item) => (
              <article key={item.id} className="gallery-card">
                <img src={item.thumbnail_url || item.image_url} alt={item.alt_text || item.title} className="gallery-thumb" />
                <div className="gallery-body">
                  <div className="gallery-header-row">
                    <strong>{item.title}</strong>
                    <span className={`status-badge ${item.is_published ? 'success' : 'warning'}`}>{item.is_published ? 'Published' : 'Hidden'}</span>
                  </div>
                  <p>{item.category_label}</p>
                  <p>{item.description || 'No description'}</p>
                  <div className="media-actions">
                    <button type="button" className="secondary-button small-button" onClick={() => handleToggle(item)}>
                      {item.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                      {item.is_published ? 'Hide' : 'Publish'}
                    </button>
                    <button type="button" className="secondary-button small-button" onClick={() => handleReorder(item, 'up')} disabled={items.indexOf(item) === 0}>
                      Up
                    </button>
                    <button type="button" className="secondary-button small-button" onClick={() => handleReorder(item, 'down')} disabled={items.indexOf(item) === items.length - 1}>
                      Down
                    </button>
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

      <div className="table-footer">
        <span>
          Showing {filteredItems.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length}
        </span>
        <div className="pagination">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>Previous</button>
          <button type="button" onClick={() => setPage((current) => Math.min(Math.ceil(filteredItems.length / pageSize) || 1, current + 1))} disabled={page >= Math.ceil(filteredItems.length / pageSize) || filteredItems.length === 0}>Next</button>
        </div>
      </div>
    </div>
  );
}
