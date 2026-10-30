# Projects

A hand-picked list of my open-source projects, served on GitHub Pages.
Plain HTML, CSS and JS, no build step.

## Adding a project

Add an entry to `projects.json`:

```json
{
  "repo": "jakub-m-arch/new-thing",
  "title": "New Thing",
  "kind": "Android app",
  "accent": "#0d8a86",
  "headline": "One sentence on why it's worth a look.",
  "blurb": "What it does, in two sentences.",
  "features": ["Three concrete things", "it does well", "in short lines"],
  "site": "https://jakub-m-arch.github.io/new-thing/",
  "install": "npx -y new-thing",
  "media": { "frame": "browser", "label": "localhost:3000", "src": "assets/shots/new-thing.jpg", "alt": "..." }
}
```

Only `repo` is required. Without `site`, the repo's **Website** field is used;
without `blurb`, the repo description.

`media` takes one of:

- `{"frame": "browser", "src": "...", "label": "..."}`: a screenshot in a window frame,
- `{"frame": "phones", "src": ["a.jpg", "b.jpg"], "dark": [...]}`: phone screenshots,
- `{"illustration": "chat"}`: a drawn illustration defined in `assets/app.js`.

`src` and `dark` can be a single path (for `browser`) or a list (for `phones`).
Put screenshots in `assets/shots/`, around 1400 px wide, as JPEG.

Language, dates, license and stars come from the GitHub API. The workflow
fetches them into `data/stats.json` on every push and once a day.

## Local preview

```bash
node scripts/fetch-stats.mjs
python3 -m http.server 8000
```

## Deploy

Settings → Pages → Source: **GitHub Actions**. Push to `main`.
