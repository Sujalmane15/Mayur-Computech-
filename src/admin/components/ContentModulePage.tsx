import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useAdminContext } from '../context/AdminContext';
import {
  appendAuditEntry,
  deleteTableRecord,
  fetchTableRecords,
  insertTableRecord,
  reorderContentRecords,
  toggleVisibilityRecord,
  updateTableRecord,
} from '../services/content';

export type ContentFieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'url' | 'file';

export type ContentFieldDefinition = {
  key: string;
  label: string;
  type?: ContentFieldType;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  helperText?: string;
  min?: number;
  max?: number;
};

export type ContentColumnDefinition = {
  key: string;
  label: string;
  render?: (row: Record<string, any>) => ReactNode;
};

export type ModulePageConfig = {
  title: string;
  description: string;
  table: string;
  select: string;
  emptyMessage: string;
  viewPermission: string;
  createPermission: string;
  updatePermission: string;
  deletePermission: string;
  publishPermission: string;
  formFields: ContentFieldDefinition[];
  columns: ContentColumnDefinition[];
  defaultValues: () => Record<string, any>;
  searchFields?: string[];
  categoryOptions?: Array<{ label: string; value: string }>;
  statusOptions?: Array<{ label: string; value: string }>;
  visibilityOptions?: Array<{ label: string; value: string }>;
  validate?: (values: Record<string, any>) => Record<string, string>;
  normalizeValues?: (values: Record<string, any>) => Record<string, any>;
  onSave?: (values: Record<string, any>, editingId?: string | null) => Promise<Record<string, any>>;
  beforeUpload?: (file: File) => Promise<Record<string, any>>;
  supportsUpload?: boolean;
  uploadLabel?: string;
  accent?: string;
  layout?: 'standard' | 'wide';
};

export function ContentModulePage({
  title,
  description,
  table,
  select,
  emptyMessage,
  viewPermission,
  createPermission,
  updatePermission,
  deletePermission,
  publishPermission,
  formFields,
  columns,
  defaultValues,
  searchFields = ['title'],
  categoryOptions = [],
  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Hidden', value: 'hidden' },
  ],
  validate,
  normalizeValues,
  onSave,
  beforeUpload,
  supportsUpload = false,
  uploadLabel = 'Upload image',
  accent = 'blue',
  layout = 'standard',
}: ModulePageConfig) {
  const { hasPermission } = useAdminContext();
  const canView = hasPermission(viewPermission);
  const canCreate = hasPermission(createPermission);
  const canUpdate = hasPermission(updatePermission);
  const canDelete = hasPermission(deletePermission);
  const canPublish = hasPermission(publishPermission);

  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [formValues, setFormValues] = useState<Record<string, any>>(defaultValues());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const rows = await fetchTableRecords(table, select, {
        search: search || undefined,
        searchField: searchFields[0],
        status: statusFilter !== 'all' ? statusFilter : undefined,
        visibility: visibilityFilter !== 'all' ? visibilityFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      setItems(rows);
      setPage(1);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unable to load records.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canView) {
      setLoading(false);
      return;
    }

    void loadItems();
  }, [canView, table, statusFilter, visibilityFilter, categoryFilter]);

  useEffect(() => {
    if (!search) {
      void loadItems();
    }
  }, [search]);

  const filteredItems = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (!lowerSearch) {
        return true;
      }

      return (searchFields ?? []).some((field) => String(item[field] ?? '').toLowerCase().includes(lowerSearch));
    });
  }, [items, search, searchFields]);

  const paginatedItems = useMemo(() => {
    const safePage = Math.max(1, page);
    const start = (safePage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const resetForm = () => {
    setFormValues(defaultValues());
    setEditingId(null);
    setFieldErrors({});
    setPendingFile(null);
  };

  const handleFieldChange = (key: string, value: string | boolean | number | null) => {
    setFormValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    const nextValues = { ...formValues };
    const validationErrors = validate ? validate(nextValues) : {};

    for (const field of formFields) {
      const value = nextValues[field.key];
      if (field.required && (value === '' || value === null || value === undefined)) {
        validationErrors[field.key] = `${field.label} is required.`;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSaving(false);
      return;
    }

    try {
      let safeValues = normalizeValues ? normalizeValues(nextValues) : nextValues;

      if (pendingFile && beforeUpload) {
        const uploadData = await beforeUpload(pendingFile);
        safeValues = { ...safeValues, ...uploadData };
      }

      if (onSave) {
        await onSave(safeValues, editingId);
      } else if (editingId) {
        await updateTableRecord(table, editingId, safeValues);
        await appendAuditEntry(table, 'update', editingId, { fields: Object.keys(safeValues) });
      } else {
        const inserted = await insertTableRecord(table, safeValues);
        await appendAuditEntry(table, 'create', inserted?.id ?? null, { fields: Object.keys(safeValues) });
      }

      setSuccess(editingId ? 'Record updated successfully.' : 'Record created successfully.');
      resetForm();
      await loadItems();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to save record.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (row: Record<string, any>) => {
    setEditingId(row.id ?? null);
    setFormValues({ ...row });
    setSuccess('');
    setError('');
    setPendingFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (row: Record<string, any>) => {
    if (!canDelete) {
      setError('You do not have permission to delete entries from this module.');
      return;
    }

    if (!window.confirm(`Delete “${row.title ?? row.name ?? row.student_name ?? 'this item'}”? This action cannot be undone.`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await deleteTableRecord(table, row.id);
      await appendAuditEntry(table, 'delete', row.id, { title: row.title ?? row.name ?? row.student_name ?? row.id });
      await loadItems();
      setSuccess('Record deleted.');
      if (editingId === row.id) {
        resetForm();
      }
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Unable to delete record.';
      setError(message);
    }
  };

  const handleVisibilityToggle = async (row: Record<string, any>) => {
    if (!canPublish) {
      setError('You do not have permission to publish or hide this module.');
      return;
    }

    try {
      const updated = await toggleVisibilityRecord(table, row);
      await appendAuditEntry(table, 'visibility_toggle', row.id, {
        previous: row.visibility,
        next: updated.visibility,
      });
      await loadItems();
      setSuccess(`${updated.title ?? row.title ?? 'Record'} is now ${updated.visibility === 'public' ? 'public' : 'hidden'}.`);
    } catch (toggleError) {
      const message = toggleError instanceof Error ? toggleError.message : 'Unable to update visibility.';
      setError(message);
    }
  };

  const handleReorder = async (row: Record<string, any>, direction: 'up' | 'down') => {
    try {
      await reorderContentRecords(table, items, row.id, direction);
      await appendAuditEntry(table, 'reorder', row.id, { direction });
      await loadItems();
      setSuccess('Order updated.');
    } catch (reorderError) {
      const message = reorderError instanceof Error ? reorderError.message : 'Unable to reorder items.';
      setError(message);
    }
  };

  const renderField = (field: ContentFieldDefinition) => {
    const value = formValues[field.key] ?? '';
    const inputId = `${table}-${field.key}`;

    if (field.type === 'checkbox') {
      return (
        <label key={field.key} className="admin-form-row checkbox-row">
          <div>
            <span>{field.label}</span>
            {field.helperText ? <small>{field.helperText}</small> : null}
          </div>
          <input
            id={inputId}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => handleFieldChange(field.key, event.target.checked)}
          />
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <label key={field.key} className="admin-form-row">
          <span>{field.label}</span>
          <textarea
            id={inputId}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(event) => handleFieldChange(field.key, event.target.value)}
          />
          {fieldErrors[field.key] ? <small className="field-error">{fieldErrors[field.key]}</small> : null}
        </label>
      );
    }

    if (field.type === 'select') {
      return (
        <label key={field.key} className="admin-form-row">
          <span>{field.label}</span>
          <select
            id={inputId}
            value={String(value ?? '')}
            onChange={(event) => handleFieldChange(field.key, event.target.value)}
          >
            <option value="">Select...</option>
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {fieldErrors[field.key] ? <small className="field-error">{fieldErrors[field.key]}</small> : null}
        </label>
      );
    }

    if (field.type === 'number') {
      return (
        <label key={field.key} className="admin-form-row">
          <span>{field.label}</span>
          <input
            id={inputId}
            type="number"
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            value={value ?? ''}
            onChange={(event) => handleFieldChange(field.key, Number(event.target.value) || 0)}
          />
          {fieldErrors[field.key] ? <small className="field-error">{fieldErrors[field.key]}</small> : null}
        </label>
      );
    }

    if (field.type === 'file') {
      return (
        <label key={field.key} className="admin-form-row">
          <span>{field.label}</span>
          <input
            id={inputId}
            type="file"
            accept={field.placeholder || 'image/*'}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPendingFile(event.target.files?.[0] ?? null)}
          />
        </label>
      );
    }

    return (
      <label key={field.key} className="admin-form-row">
        <span>{field.label}</span>
        <input
          id={inputId}
          type={field.type === 'url' ? 'url' : 'text'}
          value={String(value ?? '')}
          placeholder={field.placeholder}
          onChange={(event) => handleFieldChange(field.key, event.target.value)}
        />
        {fieldErrors[field.key] ? <small className="field-error">{fieldErrors[field.key]}</small> : null}
      </label>
    );
  };

  if (!canView) {
    return (
      <div className="admin-page empty-panel">
        <div className="panel-block">
          <h2>Access restricted</h2>
          <p>You do not have permission to view this module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-page ${layout === 'wide' ? 'wide-layout' : ''}`}>
      <div className="page-header">
        <div>
          <p className="eyebrow">Content</p>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
        {canCreate ? (
          <button type="button" className="primary-button" onClick={() => resetForm()}>
            <Plus size={16} />
            New item
          </button>
        ) : null}
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}
      {success ? <div className="alert-box success-box">{success}</div> : null}

      <div className="admin-toolbar panel-block">
        <label className="search-field">
          <Search size={16} />
          <input
            type="search"
            value={search}
            placeholder="Search records"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {(statusOptions ?? []).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
          <option value="all">All visibility</option>
          {(visibilityOptions ?? []).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        {categoryOptions.length ? (
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="main-content-grid">
        <form className="panel-block admin-form" onSubmit={handleSubmit}>
          <div className="form-header-row">
            <div>
              <p className="eyebrow">{editingId ? 'Edit' : 'Create'}</p>
              <h2>{editingId ? 'Update item' : 'Add item'}</h2>
            </div>
            {editingId ? (
              <button type="button" className="secondary-button" onClick={resetForm}>
                <X size={16} />
                Cancel
              </button>
            ) : null}
          </div>

          {formFields.map((field) => renderField(field))}

          {supportsUpload ? (
            <label className="admin-form-row">
              <span>{uploadLabel}</span>
              <input type="file" accept="image/*" onChange={(event) => setPendingFile(event.target.files?.[0] ?? null)} />
            </label>
          ) : null}

          <div className="inline-actions">
            <button type="submit" className="primary-button" disabled={isSaving || (!canCreate && !editingId) || (!canUpdate && editingId !== null)}>
              {isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Create record'}
            </button>
          </div>
        </form>

        <div className="panel-block table-panel">
          {loading ? (
            <div className="admin-loading-indicator">Loading records…</div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state-box">
              <h3>No records found</h3>
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="content-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((row) => (
                      <tr key={row.id ?? Math.random().toString(36)}>
                        {columns.map((column) => (
                          <td key={`${row.id ?? column.key}-${column.key}`}>
                            {column.render ? column.render(row) : String(row[column.key] ?? '')}
                          </td>
                        ))}
                        <td className="action-cell">
                          <div className="inline-actions compact-actions">
                            {row.visibility ? (
                              <button
                                type="button"
                                className="secondary-button small-button"
                                onClick={() => handleVisibilityToggle(row)}
                                disabled={!canPublish}
                              >
                                {row.visibility === 'public' ? <EyeOff size={14} /> : <Eye size={14} />}
                                {row.visibility === 'public' ? 'Hide' : 'Publish'}
                              </button>
                            ) : null}

                            <button type="button" className="secondary-button small-button" onClick={() => handleEdit(row)} disabled={!canUpdate && !canCreate}>
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button type="button" className="secondary-button small-button reorder-button" onClick={() => handleReorder(row, 'up')}>
                              <ArrowUp size={14} />
                            </button>
                            <button type="button" className="secondary-button small-button reorder-button" onClick={() => handleReorder(row, 'down')}>
                              <ArrowDown size={14} />
                            </button>

                            <button type="button" className="danger-button small-button" onClick={() => handleDelete(row)} disabled={!canDelete}>
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span>
                  Showing {filteredItems.length === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length}
                </span>
                <div className="pagination">
                  <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
                    Previous
                  </button>
                  <span>
                    {page} / {totalPages}
                  </span>
                  <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ value }: { value?: string | null }) {
  const tone = value === 'published' ? 'success' : value === 'draft' ? 'muted' : value === 'hidden' || value === 'archived' ? 'warning' : 'neutral';

  return <span className={`status-badge ${tone}`}>{value ?? 'unknown'}</span>;
}

export function VisibilityBadge({ value }: { value?: string | null }) {
  const tone = value === 'public' ? 'success' : value === 'hidden' ? 'warning' : 'neutral';
  return <span className={`status-badge ${tone}`}>{value ?? 'unknown'}</span>;
}

export function FeaturedBadge({ value }: { value?: boolean | null }) {
  return <span className={`status-badge ${value ? 'success' : 'neutral'}`}>{value ? 'Featured' : 'Standard'}</span>;
}
