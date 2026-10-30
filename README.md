# Projects

A hand-picked list of my open-source projects, served on GitHub Pages.
Plain HTML, CSS and JS, no build step.

## The magazine

The page is laid out as an issue of a magazine called *At Home*: a cover, an
editor's letter with contents, then one spread per project. Spreads alternate
between two layouts (a full-width picture, and a split page with the picture
on the left). The cover, the letter and the issue number live under
`magazine` in `projects.json`.

## Adding a project

Add an entry to `projects`:

```json
{
  "repo": "jakub-m-arch/new-thing",
  "title": "New Thing",
  "section": "Tools",
  "kind": "Android app",
  "accent": "#0d8a86",
  "headline": "One line on why it's worth a look.",
  "blurb": "The standfirst: what it is, in a sentence or two.",
  "story": ["Paragraph one.", "Paragraph two.", "Paragraph three."],
  "pullquote": "A short line worth repeating.",
  "caption": "What the picture shows.",
  "stats": [{ "value": "25", "label": "languages" }],
  "runsOn": "Android",
  "features": ["Three concrete things", "it does well", "in short lines"],
  "site": "https://jakub-m-arch.github.io/new-thing/",
  "install": "npx -y new-thing",
  "media": { "frame": "browser", "label": "localhost:3000", "src": "assets/shots/new-thing.jpg", "alt": "..." }
}
```

Only `repo` is required. Without `site`, the repo's **Website** field is used;
without `story`, the repo description. Page numbers follow the order of the list.

`media` takes one of:

- `{"frame": "photo", "src": "..."}`: a full-width picture, best for maps and photos,
- `{"frame": "browser", "src": "...", "label": "..."}`: an app screenshot in a window frame,
- `{"frame": "phones", "src": ["a.jpg", "b.jpg"], "dark": [...]}`: phone screenshots,
- `{"illustration": "chat"}`: a drawn illustration defined in `assets/app.js`.

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
