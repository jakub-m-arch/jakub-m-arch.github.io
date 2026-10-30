// GitHub's linguist colors for the languages in use.
const LANG_COLORS = { Rust: "#dea584", TypeScript: "#3178c6", JavaScript: "#f1e05a", Kotlin: "#a97bff", Python: "#3572a5", Go: "#00add8", Swift: "#f05138" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ICONS = {
  arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>',
  github: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
  mic: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5"/><path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2"/></svg>',
  wifi: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1.5 6a9 9 0 0 1 13 0M4 8.7a5.5 5.5 0 0 1 8 0M6.5 11.3a2 2 0 0 1 3 0"/></svg>',
  bt: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4.5 4.5 7 7L8 15V1l3.5 3.5-7 7"/></svg>',
  torch: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4.5 1.5h7v3l-2 3v7h-3v-7l-2-3z"/></svg>',
  moon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z"/></svg>',
  rotate: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 8a5.5 5.5 0 0 1 9.6-3.6M13.5 8a5.5 5.5 0 0 1-9.6 3.6M12.5 1.5v3h-3M3.5 14.5v-3h3"/></svg>',
};

// Drawn illustrations for projects without screenshots. Content mirrors the real features.
const ILLUSTRATIONS = {
  chat: () => `
    <div class="chat" role="img" aria-label="Illustration: asking Claude about training data through the MCP server">
      <p class="msg user">How did my training go this week? Plan an easy run for Saturday.</p>
      <div class="calls">
        <span class="call">get_fitness_summary</span>
        <span class="call">list_activities</span>
        <span class="call">get_wellness</span>
      </div>
      <p class="msg bot"><span class="who">Claude</span>Four runs and one long ride this week. Fitness is climbing, but fatigue is up and your sleep dipped on Thursday, so I'd keep Saturday easy: 45 minutes in zone 2.</p>
      <div class="calls"><span class="call write">create_events · Sat, Easy run 45m Z2</span></div>
    </div>`,
  dictation: () => `
    <div class="phone" role="img" aria-label="Illustration: dictating from the Quick Settings tile">
      <div class="screen">
        <div class="qs">
          <div>${ICONS.wifi}Wi-Fi</div><div>${ICONS.bt}Bluetooth</div>
          <div class="on">${ICONS.mic}Dictate</div><div>${ICONS.torch}Torch</div>
          <div>${ICONS.moon}Dark</div><div>${ICONS.rotate}Rotate</div>
        </div>
        <div class="pill"><span class="dot"></span><span class="wave">${Array.from({ length: 14 }, (_, i) => `<i style="animation-delay:${(i * 73) % 600}ms"></i>`).join("")}</span></div>
        <div class="caption"><b>Listening…</b> Running ten minutes late, start without me and I'll catch up on the notes.</div>
      </div>
    </div>
    <div class="side-card" aria-hidden="true">
      <h3>ON-DEVICE MODEL</h3>
      <p>Parakeet, 25 European languages. Speech is transcribed on the phone and never uploaded.</p>
      <div class="lang-row"><span>EN</span><span>PL</span><span>DE</span><span>FR</span><span>ES</span><span>IT</span><span>NL</span><span>+18</span></div>
    </div>`,
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, html) => {
  const node = Object.assign(document.createElement(tag), props);
  if (html !== undefined) node.innerHTML = html;
  return node;
};

async function loadJSON(url) {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function updatedAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days <= 0) return "updated today";
  if (days === 1) return "updated yesterday";
  if (days < 30) return `updated ${days} days ago`;
  if (days < 365) return `updated ${Math.round(days / 30)} mo ago`;
  return `updated ${Math.floor(days / 365)} yr ago`;
}

function titleFromRepo(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function picture(src, dark, alt) {
  const pic = document.createElement("picture");
  if (dark) pic.append(el("source", { media: "(prefers-color-scheme: dark)", srcset: dark }));
  pic.append(el("img", { src, alt: alt ?? "", loading: "lazy", decoding: "async" }));
  return pic;
}

function renderMedia(media) {
  if (!media) return null;
  if (media.illustration) {
    const frag = document.createElement("template");
    frag.innerHTML = ILLUSTRATIONS[media.illustration]?.() ?? "";
    return frag.content;
  }
  if (media.frame === "phones") {
    const wrap = el("div", { className: "phones" });
    media.src.forEach((src, i) => {
      const phone = el("div", { className: "phone" });
      phone.append(picture(src, media.dark?.[i], media.alt?.[i]));
      wrap.append(phone);
    });
    return wrap;
  }
  const win = el("div", { className: "browser" }, `<div class="bar"><i></i><i></i><i></i><span></span></div>`);
  $(".bar span", win).textContent = media.label ?? "";
  win.append(picture(media.src, media.dark, media.alt));
  return win;
}

function renderProject(project, stats, i) {
  const name = project.repo.split("/")[1];
  const title = project.title ?? titleFromRepo(name);
  const repoUrl = stats?.url ?? `https://github.com/${project.repo}`;
  const site = project.site ?? stats?.homepage ?? null;

  const section = el("section", { className: "project", id: name });
  if (project.accent) section.style.setProperty("--accent", project.accent);

  const copy = el("div", { className: "copy" });
  const label = el("p", { className: "label" });
  label.append(el("span", { className: "num", textContent: String(i + 1).padStart(2, "0") }), el("span", { textContent: project.kind ?? "" }));
  copy.append(label, el("h2", { textContent: title }));
  if (project.headline) copy.append(el("p", { className: "headline", textContent: project.headline }));
  copy.append(el("p", { className: "blurb", textContent: project.blurb ?? stats?.description ?? "" }));

  if (project.features?.length) {
    const ul = el("ul", { className: "features" });
    for (const f of project.features) ul.append(el("li", { textContent: f }));
    copy.append(ul);
  }

  if (project.install) {
    const box = el("div", { className: "install" });
    const btn = el("button", { type: "button", textContent: "Copy" });
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(project.install);
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Failed";
      }
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
    box.append(el("code", { textContent: project.install }), btn);
    copy.append(box);
  }

  const actions = el("div", { className: "actions" });
  if (site) actions.append(el("a", { className: "btn primary", href: site }, `Visit the website ${ICONS.arrow}`));
  actions.append(el("a", { className: site ? "btn" : "btn primary", href: repoUrl }, `${ICONS.github} ${site ? "Source code" : "View on GitHub"}`));
  copy.append(actions);

  const facts = el("ul", { className: "facts" });
  if (stats?.language) {
    const li = el("li", { className: "lang", textContent: stats.language });
    if (LANG_COLORS[stats.language]) li.style.setProperty("--dot", LANG_COLORS[stats.language]);
    facts.append(li);
  }
  if (stats?.license) facts.append(el("li", { textContent: stats.license }));
  if (stats?.stars) facts.append(el("li", { textContent: `★ ${stats.stars}` }));
  if (stats?.pushed) facts.append(el("li", { textContent: updatedAgo(stats.pushed) }));
  if (stats?.archived) facts.append(el("li", { textContent: "archived" }));
  copy.append(facts);

  section.append(copy);

  const visual = renderMedia(project.media);
  if (visual) {
    const stage = el("a", { className: "stage", href: site ?? repoUrl, tabIndex: -1 });
    stage.setAttribute("aria-hidden", "true");
    stage.append(visual);
    section.append(stage);
  }

  return section;
}

function renderIndex(projects) {
  const nav = $(".index");
  for (const p of projects) {
    const name = p.repo.split("/")[1];
    const a = el("a", { href: `#${name}` });
    if (p.accent) a.style.setProperty("--accent", p.accent);
    a.append(el("strong", { textContent: p.title ?? titleFromRepo(name) }), el("small", { textContent: p.kind?.split(" · ")[0] ?? "" }));
    nav.append(a);
  }
}

async function main() {
  const [config, statsFile] = await Promise.all([loadJSON("projects.json"), loadJSON("data/stats.json")]);
  if (!config) return;
  const stats = statsFile?.repos ?? {};

  renderIndex(config.projects);
  const main = $(".projects");
  config.projects.forEach((p, i) => main.append(renderProject(p, stats[p.repo], i)));

  if (statsFile?.generated) $(".updated").textContent = `Repository data from GitHub, refreshed ${formatDate(statsFile.generated)}.`;
}

main();
