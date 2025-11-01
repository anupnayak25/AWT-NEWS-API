# AWT News App (Minimal)

A tiny news reader built with plain HTML, Bootstrap, JavaScript, and jQuery. It fetches latest headlines from newsapi.org with category filters, simple pagination, and one-tap sharing. Minimal code, simple UI.

## Features

- Latest headlines by country
- Category filters: All, Business, Entertainment, General, Health, Science, Sports, Technology
- Simple pagination (Prev/Next, shows page count)
- Share button per article (Web Share API or Twitter fallback)
- API key required (no demo mode)

## Quick start

1) Get a free API key at https://newsapi.org

2) Provide your API key via environment and generate `assets/env.js`:

```bash
export NEWS_API_KEY=YOUR_NEWSAPI_KEY
bash scripts/generate_env_js.sh
```

3) Run a simple static server from the repo root and open the app:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

That’s it. Click category pills to switch topics; use Prev/Next to paginate.

## Notes on CORS and keys

- For simplicity, the API key is provided via `assets/env.js` and sent as a query parameter. For production, use a backend proxy to keep keys private.
- If you see a CORS or HTTP error, ensure your key is valid and quota not exceeded. A custom proxy avoids CORS entirely.

## File structure

- `index.html` – minimal UI and layout
- `assets/app.js` – fetching, rendering, pagination, share
- `assets/env.example.js` – template for exposing NEWS_API_KEY to the client (copy to `assets/env.js`)
- `scripts/generate_env_js.sh` – helper to generate `assets/env.js` from `$NEWS_API_KEY`
- `assets/styles.css` – tiny style tweaks

## Configuration

- Country selector defaults to US. Change from the dropdown; it’s saved in localStorage.
- Page size is 9 to fit a 3x3 grid; adjust in `assets/app.js` (state.pageSize).

## Troubleshooting

- No articles or API error: Check your key, quota, and selected country/category.
- Images broken: Placeholders are auto-shown.
- Sharing not working: Some desktop browsers don’t support Web Share; Twitter fallback opens in a new tab.

## License

MIT