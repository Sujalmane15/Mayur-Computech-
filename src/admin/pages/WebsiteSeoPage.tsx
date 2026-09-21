import { ShieldCheck } from 'lucide-react';

export function WebsiteSeoPage() {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Website</p>
          <h1>SEO</h1>
          <p className="muted">SEO configuration is prepared as a future website-control area. Core section and site settings remain the current CMS scope.</p>
        </div>
      </div>

      <div className="panel-block admin-form">
        <div className="empty-state-box">
          <ShieldCheck size={28} />
          <h3>SEO management is deferred</h3>
          <p>The current phase keeps SEO access restricted to SUPER_ADMIN only and defers full metadata editing until a schema and policy are ready.</p>
        </div>
      </div>
    </div>
  );
}
