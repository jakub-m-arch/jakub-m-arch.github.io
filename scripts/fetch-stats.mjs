// Fetches repo metadata for every project in projects.json and writes data/stats.json.
// Runs in CI before each deploy; also works locally without a token (60 requests/hour).
import { readFile, writeFile, mkdir } from "node:fs/promises";

const config = JSON.parse(await readFile("projects.json", "utf8"));
const headers = { Accept: "application/vnd.github+json", "User-Agent": "project-catalogue" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const repos = {};
for (const { repo } of config.projects) {
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) {
    console.warn(`skipping ${repo}: HTTP ${res.status}`);
    continue;
  }
  const r = await res.json();
  repos[repo] = {
    url: r.html_url,
    description: r.description,
    homepage: r.homepage || null,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
    created: r.created_at,
    pushed: r.pushed_at,
    archived: r.archived,
  };
}

await mkdir("data", { recursive: true });
await writeFile("data/stats.json", JSON.stringify({ generated: new Date().toISOString(), repos }, null, 2) + "\n");
console.log(`wrote stats for ${Object.keys(repos).length}/${config.projects.length} repos`);
