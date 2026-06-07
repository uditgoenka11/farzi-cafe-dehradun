# Farzi Café Dehradun — Website

Static, SEO-optimised website for **Farzi Café Dehradun** — modern Indian bistro and rooftop bar at Pacific Mall, Jakhan, Rajpur Road. Built as plain HTML + CSS + JS, ready to deploy to GitHub Pages or any static host.

## What's inside

```
farzi-cafe-dehradun/
├── index.html              Home (video hero + signatures + ambience + CTA)
├── menu.html               Full categorised menu with Schema.org Menu markup
├── gallery.html            Filterable gallery + lightbox + embedded videos
├── events.html             Brunches, private dining, upcoming events
├── about.html              Brand story, chef philosophy, timeline, awards
├── contact.html            Address, hours, reservation form, Google Map
├── blog.html               Blog index (6 posts)
├── blog/
│   ├── dal-chawal-arancini-story.html
│   ├── dehradun-food-guide.html
│   └── curry-leaf-gimlet-recipe.html
├── css/
│   └── style.css           Single global stylesheet (dark, gold-on-black bistro)
├── js/
│   └── main.js             Nav, lightbox, gallery filter, reveal, form
├── images/
│   ├── hero/               Above-the-fold imagery (1920px)
│   ├── about/              About-page imagery (1600px)
│   ├── menu/               Plated food + cocktails (1400px)
│   ├── events/             Events imagery (1600px)
│   └── gallery/            37 gallery images (1400px)
├── videos/                 5 looping MP4 reels
├── sitemap.xml             10 URLs, image sitemap on home
├── robots.txt
├── favicon.svg             Gold-on-black Farzi monogram
└── .nojekyll               Disables GitHub Pages Jekyll processing
```

## SEO checklist (already done)

- ✅ Unique `<title>`, `<meta description>`, `<meta keywords>`, canonical URL per page
- ✅ Open Graph + Twitter Card tags on every page
- ✅ Geo meta tags (region, position, ICBM) for local SEO
- ✅ Schema.org JSON-LD on every page:
  - Home → `Restaurant` with full address, hours, rating, menu URL
  - Menu → `Menu` with sections and items
  - Gallery → `ImageGallery`
  - Events → `Event` markup with offers
  - About → `Organization` with founder + parent
  - Contact → `ContactPage` with mainEntity
  - Blog index → `Blog`
  - Blog posts → `BlogPosting` (or `Recipe` for the cocktail post)
- ✅ Semantic HTML (`<header>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- ✅ `loading="lazy"` on all non-hero images
- ✅ Descriptive `alt` text on every image
- ✅ `sitemap.xml` (with image sitemap on home) + `robots.txt`
- ✅ Mobile-first responsive layout
- ✅ `<link rel="canonical">` on all pages
- ✅ `aria-` labels on interactive elements
- ✅ Reduced-motion media query respected

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `farzi-cafe-dehradun`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Farzi Café Dehradun website"
   git branch -M main
   git remote add origin git@github.com:YOUR-USERNAME/farzi-cafe-dehradun.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / root**.
4. Wait ~30 seconds. Your site will be at `https://YOUR-USERNAME.github.io/farzi-cafe-dehradun/`.
5. **Custom domain** (optional): point your domain's DNS at GitHub Pages and add a `CNAME` file in the root with the domain (e.g. `farzicafe-dehradun.com`). Update the canonical URLs and JSON-LD inside each HTML file from `https://farzicafe-dehradun.com/` to your actual domain.

## Customising

| What | Where |
|---|---|
| Phone, email | `index.html`, `contact.html`, footer of every page |
| Address, hours | Same as above + Schema.org JSON-LD blocks |
| Menu items + prices | `menu.html` (the `.menu-item` blocks) |
| Events list | `events.html` (the `.event-row` blocks) |
| Blog posts | `blog.html` (index) + add new `.html` files inside `blog/` |
| Brand colours | CSS custom properties at the top of `css/style.css` (`--color-gold`, `--color-bg`, etc.) |
| Hero video | `index.html` — `<source src="videos/farzi-cafe-tour-1.mp4">` |
| Social links | `index.html` footer + `contact.html` |
| Google Maps embed | `contact.html` — `<iframe>` src |

## After deploy: a few easy wins

- Submit `sitemap.xml` to **Google Search Console** and **Bing Webmaster Tools**.
- Claim your **Google Business Profile** for "Farzi Café Dehradun" — link it to this site.
- Add a **Google Analytics** or **Plausible** tag (one line in `<head>`).
- Replace the `+91 98765 43210` placeholder phone with the real number across all files.
- Replace placeholder Instagram/Facebook URLs with the real ones (3 places in each footer + 2 social-links blocks).

## Performance notes

- All images optimised with `sips -Z` (max 1920px hero, 1400px gallery). Total image weight ~17 MB across 50+ assets.
- Videos kept as MP4 (already H.264-compressed). Total ~37 MB. For lighter mobile loads, consider creating a 720p version of the hero video and using `<picture>`/`<source media>` to swap.
- Fonts loaded from Google Fonts with `preconnect`. For even faster loads on production, consider self-hosting the WOFF2 files.
- No build step, no JS framework, no dependencies. Total JS payload ~3 KB. Plays nicely with HTTP/2 and any CDN.

## Credits

- Photography & videos: Farzi Café Dehradun team.
- Design & build: Claude Code, on commission from the Farzi Café Dehradun team.

---

**Live address:** Rooftop, Pacific Mall, Jakhan, Rajpur Road, Dehradun 248001 · [Get directions](https://maps.app.goo.gl/6Ymuwk7bfogPwDnz5)
