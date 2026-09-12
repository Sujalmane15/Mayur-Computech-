# Mayur Computech

Website for Mayur Computech.

Live website: **https://Sujalmane15.github.io/Mayur-Computech/** 🚀

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
- Install dependencies → `npm run build` → deploy the `dist/` output
- The site uses Vite's `base: '/Mayur-Computech/'` so all CSS, JavaScript and image
  paths resolve correctly under the `/Mayur-Computech/` subpath

**Live URL:** https://Sujalmane15.github.io/Mayur-Computech/

> GitHub Pages must be enabled once in the repository settings:
> **Settings → Pages → Source: *GitHub Actions*** (never deploy from a branch).

---

© Mayur Computech. All Rights Reserved. Designed for Excellence.