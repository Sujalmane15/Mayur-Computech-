# Mayur Computech

Website for Mayur Computech.

Live website: **https://sujalmane15.github.io/Mayur-Computech-/** 🚀

---

## 📌 Website Purpose

Official website for **Mayur Computech**, a Government Authorised Computer Training
Institute located in Sector 5, Ghansoli, Navi Mumbai (Center Code: **78210482**).

The site showcases:

- 12 career-focused computer courses (MS-CIT, MS Office, Advanced Excel, Tally Prime,
  Digital Marketing, C/C++, Web Development, Java, Marathi/English Typing, AI & Robotics, Power BI)
- Institute highlights and mentor profiles (Mayur Sir & Sujal Sir)
- Real student testimonials and Google reviews (4.9 ★, 200+ reviews)
- Photo gallery of the lab, typing arena, and certificate ceremonies
- Quick admission enquiry via WhatsApp and call

## 🛠️ Technologies Used

- **HTML5 + CSS3** — custom responsive layout (`index.html`, `styles.css`)
- **Vanilla JavaScript** — interactive course filters, gallery lightbox, FAQ accordion,
  mobile hamburger menu, scrollspy, and enquiry form (`script.js`)
- **Vite** — development server and production build tooling
- **Font Awesome 6** (CDN) — icons
- **Google Fonts** (CDN) — typography

## 💻 How to Run Locally

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.
The dev server hot-reloads automatically when you edit files.

## 🏗️ Build Command

```bash
npm run build
```

This produces the production-ready site in the `dist/` folder.
Preview the production build locally with:

```bash
npm run preview
```

## 🚀 GitHub Pages Deployment

This repository is configured to deploy automatically to GitHub Pages using
**GitHub Actions** (see `.github/workflows/deploy.yml`).

- The workflow runs on every **push to `main`**
- This is a **plain static site** — `index.html` + `styles.css` + `script.js`
  + images are deployed **directly, with no build step**
  (no `npm run build` / no Vite processing, so relative paths like
  `script.js` / `styles.css` keep working exactly as on localhost)
- `vite.config.ts` `base: '/Mayur-Computech-/'` is only for local
  `npm run dev` / `npm run build` previews — it is NOT used by the
  Pages deployment

**Live URL:** https://sujalmane15.github.io/Mayur-Computech-/

> GitHub Pages must be enabled once in the repository settings:
> **Settings → Pages → Source: *GitHub Actions*** (never deploy from a branch).

## ImageKit Gallery

The Gallery section is rendered from `gallery-data.js` and does not bundle gallery image files. To publish photos:

1. Upload images to ImageKit, preferably under `/mayur-computech/gallery/`.
2. Set the public URL endpoint in `gallery-data.js`.
3. Add one item per image with its ImageKit path, accessible alt text, title, description, and category.
4. Push to `main` so the existing GitHub Pages workflow deploys the updated static files.

Only the public ImageKit URL endpoint belongs in frontend configuration. Never add an ImageKit private key or upload credentials to this repository.

## Admin Gallery CMS

The public site remains a static GitHub Pages deployment. The admin panel lives at `/admin/` and uses Supabase Auth and PostgreSQL; ImageKit upload and deletion happen through Supabase Edge Functions so the ImageKit private key never reaches the browser.

### Supabase setup

1. Create a Supabase project and enable email/password authentication.
2. Run `supabase/migrations/202609190001_gallery.sql` in the SQL editor.
3. Create the first user in Supabase Auth, then insert that user's UUID into `public.admin_users` as shown at the bottom of the migration.
4. Deploy `supabase/functions/imagekit-upload` and `supabase/functions/imagekit-delete` with the Supabase CLI.
5. Configure Edge Function secrets: `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, and optionally `IMAGEKIT_PUBLIC_KEY`.
6. Put the Supabase project URL and anon key into `gallery-data.js` as `supabaseUrl` and `supabaseAnonKey`. The anon key is public; do not put a service-role key there.

To preserve the current static gallery during migration, run `npm run seed:gallery`, review the generated `supabase/seed-gallery.generated.sql`, and run it in Supabase. After the database is configured, the public site reads only published database rows. Until then it uses the existing ImageKit configuration as a fallback.

### Admin workflow

Open `/Mayur-Computech-/admin/`, sign in with the Supabase Auth account, then add or edit gallery items. Choose a JPG, PNG, or WEBP image up to 8 MB; the browser sends it to the authenticated upload Edge Function. Use Publish/Hide, Up/Down, Edit, and Delete controls to manage the public gallery. Delete asks for confirmation and removes the database row before attempting to remove the stored ImageKit asset.

### Deployment and security

GitHub Pages serves `index.html`, `gallery-data.js`, and `admin/` as static files. Supabase supplies authentication, RLS-protected metadata, and Edge Functions; ImageKit supplies CDN delivery. Public RLS permits only published gallery reads. Insert, update, and delete policies require a row in `admin_users`. Never commit `.env`, a Supabase service-role key, an ImageKit private key, or upload signatures.

---

© Mayur Computech. All Rights Reserved. Designed for Excellence.