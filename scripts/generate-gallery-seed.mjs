import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../gallery-data.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const config = context.window.MAYUR_GALLERY_CONFIG;
const quote = value => `'${String(value ?? '').replaceAll("'", "''")}'`;
const rows = (config.items || []).map((item, index) => {
  const endpoint = config.imageKitUrlEndpoint.replace(/\/$/, '');
  const path = item.path;
  const imageUrl = `${endpoint}/${path.replace(/^\//, '')}`;
  return `(${quote(item.title)}, ${quote(item.description)}, ${quote(item.alt)}, ${quote(imageUrl)}, ${quote(path)}, ${quote(item.category)}, ${quote(item.categoryLabel)}, ${index}, true)`;
});
const output = `-- Generated from gallery-data.js. Review before running in Supabase.\ninsert into public.gallery_items (title, description, alt_text, image_url, image_path, category, category_label, display_order, is_published) values\n${rows.join(',\n')};\n`;
fs.writeFileSync('supabase/seed-gallery.generated.sql', output);
console.log(`Generated ${rows.length} gallery rows at supabase/seed-gallery.generated.sql`);
