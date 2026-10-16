# Le Petit Atelier — design preview

Static Greek website for the selected pale-blue / navy / coral design. Plain HTML, CSS and ES modules; no framework, bundler, database or runtime dependencies.

## Run

From this folder: `python -m http.server 4173 --bind 127.0.0.1 --directory site`.
Open `http://127.0.0.1:4173`. Checks: `node tools/check.mjs`.

GitHub Pages publishes **only `site/`** using `.github/workflows/pages.yml`. All asset URLs are relative, including module imports, so repository subpaths work. No domain is connected. The preview is marked `noindex, nofollow` with `robots.txt` disallowing crawling; these are indexing requests, not access controls.

## Preview behavior

- Responsive navigation, dog/cat care categories, coat-based service filtering, and optional size/breed information.
- `work.html` presents four selected stories with descriptions and source links. It includes a same-post before/after comparison, a third photo in a native disclosure, and dog/cat/before-after filters. The homepage links to three highlights. Content and cross-page links work without JavaScript; filtering is a progressive enhancement.
- Service buttons prefill the appointment form. Dates use Europe/Athens; preferred dates are not availability slots.
- The appointment form is explicitly a **demo**. It validates and previews a request locally. It does not send emails, make bookings, store entered data, or call a backend. Without JavaScript its fields are disabled. No analytics, embedded third-party widgets or remote fonts load at runtime.
- Telephone, Google Maps and Instagram links are real external links. Do not use the demo form for actual bookings.

## Content and WordPress migration

- `site/index.html`: semantic sections, Greek text, actual image references, and form field names.
- `site/assets/styles.css`: independent styling with centralized colors and fonts. No framework-specific markup.
- `site/assets/care-data.js`: animal types, coat types, sizes and service content, separately from UI behavior.
- `site/assets/app.js`: progressive interactions and demo-only form behavior.
- `site/assets/navigation.js`: menu behavior shared by the homepage and portfolio.
- `site/work.html` and `site/assets/work.js`: static portfolio content and optional filtering. Each story has a stable anchor; no iframe or social feed is loaded.
- `site/assets/images/`: curated original business photos from the existing proposal references. See `ASSET-SOURCES.md`.

After customer approval, move the section markup into a WordPress theme (`header`, `front-page`, `footer` / block patterns). Enqueue the existing stylesheet and interaction module with WordPress-generated asset URLs. Move editable services/gallery content into WordPress fields or blocks; keep stable IDs `dog`, `cat`, `bath`, `haircut`, `coat` where appropriate. The animal and coat categorization does not infer a grooming treatment from a breed.

For the portfolio, map each story to a WordPress entry with title, animal category, description, result photo, optional before photo/additional photos, and source link. The owner can then publish a new result without editing code. The static preview uses authored HTML; it does not currently sync with Facebook. Keep comparison photos together only when they belong to the same animal/session. Confirm the proposed Oct 1 pairing and descriptions with the owner before business launch (see asset provenance).

Replace only the demo submission behavior with a server-backed WordPress form: server-side validation, nonce, spam/rate protection, configured recipient, delivery error handling and verified email delivery. Finalize privacy information and retention with the owner. The confirmation message must still distinguish an inquiry from a confirmed appointment. Do not activate sending by changing only the button text.

This is not a completed WordPress theme, and migration is a later implementation step. Before business launch, the owner should confirm service wording and photo/logo usage. The original header logo is only 150px; obtain the high-resolution original for final delivery. No prices, hours, ratings or medical outcomes have been invented.

References: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [WordPress template files](https://developer.wordpress.org/themes/classic-themes/basics/template-files/), [W3C forms](https://www.w3.org/WAI/tutorials/forms/).
