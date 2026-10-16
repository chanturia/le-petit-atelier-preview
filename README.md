# Le Petit Atelier — design preview

Static Greek website for the selected pale-blue / navy / coral design. Plain HTML, CSS and ES modules; no framework, bundler, database or runtime dependencies.

## Run

From this folder: `python -m http.server 4173 --bind 127.0.0.1 --directory site`.
Open `http://127.0.0.1:4173`. Checks: `node tools/check.mjs`.

GitHub Pages publishes **only `site/`** using `.github/workflows/pages.yml`. All asset URLs are relative, including module imports, so repository subpaths work. No domain is connected. The preview is marked `noindex, nofollow` with `robots.txt` disallowing crawling; these are indexing requests, not access controls.

## Preview behavior

- Responsive navigation, dog/cat care categories, coat-based service filtering, optional size/breed information, and gallery filters.
- Service buttons prefill the appointment form. Dates use Europe/Athens; preferred dates are not availability slots.
- The appointment form is explicitly a **demo**. It validates and previews a request locally. It does not send emails, make bookings, store entered data, or call a backend. Without JavaScript its fields are disabled. No analytics, embedded third-party widgets or remote fonts load at runtime.
- Telephone, Google Maps and Instagram links are real external links. Do not use the demo form for actual bookings.

## Content and WordPress migration

- `site/index.html`: semantic sections, Greek text, actual image references, and form field names.
- `site/assets/styles.css`: independent styling with centralized colors and fonts. No framework-specific markup.
- `site/assets/care-data.js`: animal types, coat types, sizes and service content, separately from UI behavior.
- `site/assets/app.js`: progressive interactions and demo-only form behavior.
- `site/assets/images/`: curated original business photos from the existing proposal references. See `ASSET-SOURCES.md`.

After customer approval, move the section markup into a WordPress theme (`header`, `front-page`, `footer` / block patterns). Enqueue the existing stylesheet and interaction module with WordPress-generated asset URLs. Move editable services/gallery content into WordPress fields or blocks; keep stable IDs `dog`, `cat`, `bath`, `haircut`, `coat` where appropriate. The animal and coat categorization does not infer a grooming treatment from a breed.

Replace only the demo submission behavior with a server-backed WordPress form: server-side validation, nonce, spam/rate protection, configured recipient, delivery error handling and verified email delivery. Finalize privacy information and retention with the owner. The confirmation message must still distinguish an inquiry from a confirmed appointment. Do not activate sending by changing only the button text.

This is not a completed WordPress theme, and migration is a later implementation step. Before business launch, the owner should confirm service wording and photo/logo usage. The original header logo is only 150px; obtain the high-resolution original for final delivery. No prices, hours, ratings or medical outcomes have been invented.

References: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [WordPress template files](https://developer.wordpress.org/themes/classic-themes/basics/template-files/), [W3C forms](https://www.w3.org/WAI/tutorials/forms/).
