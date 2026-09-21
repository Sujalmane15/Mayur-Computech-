import type { ReactNode } from 'react';

export function PlaceholderPage({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="admin-empty-state">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
