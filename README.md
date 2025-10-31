# Trilp AI — Official Website

Trilp AI is a calm, independent learning studio based in Pune, India.  
It offers concise books and small quizzes to help software developers learn AI & Machine Learning **at a human pace**.  
This repository contains the source code for the official website: **https://www.trilp.in**

---

## 🧭 Philosophy

The intention behind Trilp AI is simple:

- **Understanding over urgency**  
- **Depth over volume**  
- **Steady practice over rushed outcomes**

Books are concise, refined slowly, and designed to be absorbed without hurry.  
Quizzes reinforce recall, allowing concepts to settle over time.

---

## 🌐 Live Website

**Primary (Custom Domain):**  
https://www.trilp.in

**Backup (GitHub Pages):**  
https://trilpai.github.io

---

## 🧱 Tech Stack

| Layer | Choice | Reason |
|------|--------|--------|
| Site | Static HTML | Fast, reliable, low maintenance |
| Styling | Tailwind CSS (locally compiled) | Utility-first, clean, expressive |
| Fonts | Inter (local `.woff2`) | Professional, readable on all devices |
| Deployment | GitHub Pages | Zero-infrastructure, HTTPS, auto-build |
| Build Tools | Tailwind CLI + PostCSS + Autoprefixer | Minimal & modern front‑end pipeline |

---

## 📦 Project Structure

```
.
├── index.html              # Main website
├── CNAME                   # Custom domain configuration
├── robots.txt              # Search engine instructions
├── sitemap.xml             # XML sitemap for crawler discovery
├── humans.txt              # Human-readable site attribution
└── assets/
    ├── css/
    │   ├── tailwind.css    # Source styles (edit this)
    │   └── style.css       # Compiled styles (do not edit)
    ├── css/font/           # Inter font files
    ├── img/                # Logos, OG image, favicons
    └── js/                 # Optional scripts
```

---

## 🛠️ Development

Install dependencies:

```sh
npm install
```

Build CSS:

```sh
npm run build
```

Watch & rebuild on save while developing:

```sh
npm run watch
```

Also, local webserver run can be achieved using:

```sh
python -m http.server
```

> **Note:** Edit only `tailwind.css`.  
> `style.css` is generated — do not modify it directly.

---

## 🚀 Deployment

Just commit and push to `main`:

```sh
git add .
git commit -m "Update website"
git push
```

GitHub Pages will redeploy automatically.

---

## 🔍 SEO & Structured Metadata

The site includes:

- **Organization** + **WebSite** schema
- **OpenGraph** preview cards for social sharing
- **Twitter/LinkedIn/WhatsApp friendly** share image
- Local SEO metadata for Pune, Maharashtra
- Canonical URLs
- Sitemap & robots configuration

These improve discoverability and ensure clean link previews when shared.

---

## © License & Branding

This project is released under the **MIT License**.  
See [`LICENSE`](LICENSE) for the complete text.

However:

> **The Trilp AI name, logo, and brand identity are proprietary.**  
They may not be reused for representation, marketing, or commercial use without explicit permission.

---

## 📬 Contact

**Email:** info@trilp.in  
**Location:** Pune, Maharashtra, India  
**Founder:** Pradyumna Das Roy

Follow the studio:

- LinkedIn: https://www.linkedin.com/company/trilpai  
- YouTube: https://www.youtube.com/@trilpai  
- Instagram: https://www.instagram.com/trilpai/  
- GitHub: https://github.com/trilpai  
- Facebook: https://www.facebook.com/trilpai  

---

Maintained with steadiness and intent.
