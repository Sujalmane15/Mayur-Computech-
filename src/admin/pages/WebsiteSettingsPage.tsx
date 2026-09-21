import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '../services/auth';

type SiteSettingRecord = {
  key: string;
  value: Record<string, any>;
  description?: string;
  is_public?: boolean;
};

const defaultSettings: Record<string, any> = {
  business_name: 'Mayur Computech',
  tagline: 'Learn Today • Build Tomorrow',
  phone: '8655050595',
  email: '',
  address: 'Sector 5, Ghansoli, Navi Mumbai',
  whatsapp: 'https://wa.me/918655050595',
  facebook: 'https://www.facebook.com',
  youtube: 'https://youtube.com',
  instagram: 'https://www.instagram.com',
  logo_url: '',
  primary_cta_label: 'Enquire Now',
  primary_cta_url: '#contact',
};

export function WebsiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSettings = async () => {
    const client = createSupabaseClient();
    if (!client) {
      setError('Supabase configuration is missing.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: settingsError } = await client.from('site_settings').select('*').order('created_at', { ascending: false });
      if (settingsError) throw settingsError;

      const merged: Record<string, any> = { ...defaultSettings };
      for (const row of data ?? []) {
        if (row?.key && row?.value && typeof row.value === 'object') {
          merged[row.key] = { ...merged[row.key], ...row.value };
        }
      }
      setSettings(merged);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load website settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleTextChange = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    const client = createSupabaseClient();
    if (!client) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const entries = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        description: 'Public website configuration',
        is_public: true,
      }));

      for (const entry of entries) {
        const { data: existing } = await client.from('site_settings').select('id').eq('key', entry.key).maybeSingle();
        if (existing?.id) {
          const { error: updateError } = await client.from('site_settings').update({ value: entry.value, is_public: true }).eq('id', existing.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await client.from('site_settings').insert({ ...entry });
          if (insertError) throw insertError;
        }
      }

      setSuccess('Website settings updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Website</p>
          <h1>Website Settings</h1>
          <p className="muted">Public business settings remain safe and schema-driven. Keep this limited to website metadata.</p>
        </div>
      </div>

      {error ? <div className="alert-box error-box">{error}</div> : null}
      {success ? <div className="alert-box success-box">{success}</div> : null}

      <form className="panel-block admin-form" onSubmit={(event) => { event.preventDefault(); void saveSettings(); }}>
        {loading ? <div className="admin-loading-indicator">Loading settings…</div> : null}

        {!loading ? (
          <>
            <label className="admin-form-row">
              <span>Business name</span>
              <input value={settings.business_name ?? ''} onChange={(event) => handleTextChange('business_name', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Tagline</span>
              <input value={settings.tagline ?? ''} onChange={(event) => handleTextChange('tagline', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Phone</span>
              <input value={settings.phone ?? ''} onChange={(event) => handleTextChange('phone', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Email</span>
              <input value={settings.email ?? ''} onChange={(event) => handleTextChange('email', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Address</span>
              <textarea value={settings.address ?? ''} onChange={(event) => handleTextChange('address', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>WhatsApp link</span>
              <input value={settings.whatsapp ?? ''} onChange={(event) => handleTextChange('whatsapp', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Primary CTA label</span>
              <input value={settings.primary_cta_label ?? ''} onChange={(event) => handleTextChange('primary_cta_label', event.target.value)} />
            </label>

            <label className="admin-form-row">
              <span>Primary CTA URL</span>
              <input value={settings.primary_cta_url ?? ''} onChange={(event) => handleTextChange('primary_cta_url', event.target.value)} />
            </label>

            <div className="inline-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                <Save size={16} />
                {saving ? 'Saving...' : 'Save settings'}
              </button>
            </div>
          </>
        ) : null}
      </form>
    </div>
  );
}
