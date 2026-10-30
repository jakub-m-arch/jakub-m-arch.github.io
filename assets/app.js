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
    <div class="dictation">
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
    </div>
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

const SEASONS = ["Winter", "Winter", "Spring", "Spring", "Spring", "Summer", "Summer", "Summer", "Autumn", "Autumn", "Autumn", "Winter"];
const pad = (n) => String(n).padStart(2, "0");
// Cover is page 1, the letter and contents pages 2–3, then each project takes a two-page spread.
const pageOf = (i) => 4 + i * 2;

function issueLine(mag) {
  const now = new Date();
  return `No. ${pad(mag.issue ?? 1)} · ${SEASONS[now.getMonth()]} ${now.getFullYear()}`;
}

function copyButton(text) {
  const btn = el("button", { type: "button", textContent: "Copy" });
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Failed";
    }
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
  return btn;
}

// Decorative barcode, stable for a given string.
function drawBarcode(svg, seed) {
  let h = 7;
  let x = 0;
  const bars = [];
  while (x < 116) {
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    h = (h * 17 + x) % 9973;
    const w = 1 + (h % 3);
    if (h % 5 !== 0) bars.push(`<rect x="${x}" y="0" width="${w}" height="${x < 4 || x > 110 ? 44 : 38}"/>`);
    x += w + 1 + ((h >> 3) % 2);
  }
  svg.setAttribute("viewBox", "0 0 120 44");
  svg.innerHTML = bars.join("");
}

// Fills a band: screenshots as photos or windows, phones and illustrations on the accent color.
function renderBand(media, href) {
  const band = el("a", { className: "band", href, tabIndex: -1 });
  band.setAttribute("aria-hidden", "true");
  if (!media) return band;

  if (media.illustration) {
    const tpl = document.createElement("template");
    tpl.innerHTML = ILLUSTRATIONS[media.illustration]?.() ?? "";
    band.append(tpl.content);
  } else if (media.frame === "phones") {
    const wrap = el("div", { className: "phones" });
    media.src.forEach((src, i) => {
      const phone = el("div", { className: "phone" });
      phone.append(picture(src, media.dark?.[i], media.alt?.[i]));
      wrap.append(phone);
    });
    band.append(wrap);
  } else if (media.frame === "browser") {
    band.classList.add("window");
    const win = el("div", { className: "browser" }, `<div class="bar"><i></i><i></i><i></i><span></span></div>`);
    $(".bar span", win).textContent = media.label ?? "";
    win.append(picture(media.src, media.dark, media.alt));
    band.append(win);
  } else {
    band.classList.add("photo");
    band.append(picture(media.src, media.dark, media.alt));
  }
  return band;
}

function renderCover(mag, projects) {
  const words = mag.name.split(" ");
  const last = words.pop();
  $(".masthead").textContent = words.length ? words.join(" ") + " " : "";
  $(".masthead").append(el("em", { textContent: last }));
  $(".issue-line").textContent = issueLine(mag);
  $(".tagline").textContent = mag.tagline ?? "";
  $(".coverline").textContent = mag.coverline ?? "";
  if (mag.cover?.background) $(".cover").style.setProperty("--cover-bg", mag.cover.background);
  for (const src of mag.cover?.phones ?? []) {
    const phone = el("div", { className: "phone" });
    phone.append(picture(src));
    $(".cover-art").append(phone);
  }

  const ul = $(".coverlines");
  projects.forEach((p, i) => {
    const name = p.repo.split("/")[1];
    const a = el("a", { href: `#${name}` });
    if (p.accent) a.style.setProperty("--accent", p.accent);
    a.append(
      el("span", { className: "pg", textContent: pad(pageOf(i)) }),
      el("strong", { textContent: p.title ?? titleFromRepo(name) }),
      el("small", { textContent: p.headline ?? "" })
    );
    const li = el("li");
    li.append(a);
    ul.append(li);
  });

  drawBarcode($(".barcode svg"), mag.name + issueLine(mag));
  $(".barcode span").textContent = `${pad(mag.issue ?? 1)} ${new Date().getFullYear()}`;
}

function renderFront(mag, projects) {
  $(".front .folio-l").innerHTML = `<b>02</b> · `;
  $(".front .folio-l").append(`${mag.name} · ${issueLine(mag)}`);

  const body = $(".letter-body");
  for (const p of mag.letter ?? []) body.append(el("p", { textContent: p }));
  $(".signature").textContent = mag.signature ?? "";

  const ol = $(".contents ol");
  projects.forEach((p, i) => {
    const name = p.repo.split("/")[1];
    const a = el("a", { href: `#${name}` });
    if (p.accent) a.style.setProperty("--accent", p.accent);
    a.append(
      el("span", { className: "pg", textContent: pad(pageOf(i)) }),
      el("span", { className: "sec", textContent: p.section ?? p.kind ?? "" }),
      el("strong", { textContent: p.title ?? titleFromRepo(name) }),
      el("small", { textContent: p.headline ?? "" })
    );
    const li = el("li");
    li.append(a);
    ol.append(li);
  });
}

function renderSpread(project, stats, i, mag) {
  const name = project.repo.split("/")[1];
  const title = project.title ?? titleFromRepo(name);
  const repoUrl = stats?.url ?? `https://github.com/${project.repo}`;
  const site = project.site ?? stats?.homepage ?? null;
  const layout = i % 2 === 0 ? "feature" : "split";

  const spread = el("article", { className: `spread page ${layout}`, id: name });
  if (project.accent) spread.style.setProperty("--accent", project.accent);

  // running head and folio
  const running = el("div", { className: "running" });
  running.append(el("span", {}, `<b></b>`), el("span", { textContent: project.kind ?? "" }));
  $("b", running).textContent = project.section ?? "";
  running.firstChild.append(` · ${title}`);

  const folio = el("div", { className: "folio" });
  folio.append(el("span", {}, `<b>${pad(pageOf(i))}</b> `), el("span", {}, ` <b>${pad(pageOf(i) + 1)}</b>`));
  folio.firstChild.append(`${mag.name} · ${issueLine(mag)}`);
  folio.lastChild.prepend(`${project.section ?? title} ·`);

  // headline block
  const head = el("header", { className: "head" });
  head.append(el("p", { className: "kicker", textContent: project.section ?? "" }));
  const h2 = el("h2");
  h2.append(el("a", { href: site ?? repoUrl, textContent: title }));
  head.append(h2);
  if (project.headline) head.append(el("p", { className: "deck", textContent: project.headline }));

  // picture with caption
  const figure = el("figure");
  figure.append(renderBand(project.media, site ?? repoUrl));
  if (project.caption) {
    const cap = el("figcaption", {}, `<b>Fig. ${i + 1}</b>`);
    cap.append(project.caption);
    figure.append(cap);
  }

  // article body with the pull quote after the first paragraph
  const body = el("div", { className: "body" });
  (project.story ?? [stats?.description ?? ""]).forEach((text, n) => {
    body.append(el("p", { textContent: text }));
    if (n === 0 && project.pullquote) body.append(el("blockquote", { className: "pullquote", textContent: project.pullquote }));
  });

  const standfirst = el("p", { className: "standfirst", textContent: project.blurb ?? "" });

  const statList = el("ul", { className: "stats" });
  for (const s of project.stats ?? []) {
    const li = el("li");
    li.append(el("b", { textContent: s.value }), el("span", { textContent: s.label }));
    statList.append(li);
  }

  // sidebar: at a glance, spec sheet, links
  const glance = el("section", { className: "box" }, `<h3>At a glance</h3>`);
  const gl = el("ul");
  for (const f of project.features ?? []) gl.append(el("li", { textContent: f }));
  glance.append(gl);

  const spec = el("section", { className: "box" }, `<h3>Spec sheet</h3>`);
  const dl = el("dl", { className: "spec" });
  const row = (k, v, cls) => {
    if (!v) return;
    dl.append(el("dt", { textContent: k }));
    const dd = el("dd", { textContent: v, className: cls ?? "" });
    if (cls === "lang" && LANG_COLORS[v]) dd.style.setProperty("--dot", LANG_COLORS[v]);
    dl.append(dd);
  };
  row("Runs on", project.runsOn);
  row("Written in", stats?.language, "lang");
  row("License", stats?.license);
  row("Updated", stats?.pushed && updatedAgo(stats.pushed).replace("updated ", ""));
  if (stats?.stars) row("Stars", `★ ${stats.stars}`);
  if (stats?.archived) row("Status", "Archived");
  spec.append(dl);
  if (project.install) {
    const box = el("div", { className: "install" });
    box.append(el("code", { textContent: project.install }), copyButton(project.install));
    spec.append(box);
  }

  const actions = el("div", { className: "actions" });
  if (site) actions.append(el("a", { className: "btn primary", href: site }, `<span>Visit the website</span>${ICONS.arrow}`));
  actions.append(el("a", { className: site ? "btn" : "btn primary", href: repoUrl }, `<span>${site ? "Source on GitHub" : "Read on GitHub"}</span>${ICONS.github}`));

  const article = el("div", { className: "article" });
  if (layout === "feature") {
    const lede = el("div", { className: "lede" });
    lede.append(standfirst, statList);
    const sidebar = el("aside", { className: "sidebar" });
    sidebar.append(glance, spec);
    spec.append(actions);
    article.append(lede, body, sidebar);
    spread.append(running, head, figure, article, folio);
  } else {
    const side = el("aside", { className: "side" });
    spec.append(actions);
    side.append(glance, spec);
    article.append(standfirst, body, statList, side);
    const copy = el("div", { className: "copy" });
    copy.append(running, head, article, folio);
    spread.append(figure, copy);
  }
  return spread;
}

// Bands settle into place the first time they scroll into view.
function revealBands() {
  const bands = document.querySelectorAll(".band");
  if (!("IntersectionObserver" in window)) return bands.forEach((b) => b.classList.add("seen"));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("seen");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });
  bands.forEach((b) => io.observe(b));
}

async function main() {
  const [config, statsFile] = await Promise.all([loadJSON("projects.json"), loadJSON("data/stats.json")]);
  if (!config) return;
  const stats = statsFile?.repos ?? {};
  const mag = { name: "At Home", ...config.magazine };

  renderCover(mag, config.projects);
  renderFront(mag, config.projects);
  const spreads = $(".spreads");
  config.projects.forEach((p, i) => spreads.append(renderSpread(p, stats[p.repo], i, mag)));
  revealBands();

  if (statsFile?.generated) $(".updated").textContent = `Repository data from GitHub, refreshed ${formatDate(statsFile.generated)}.`;
}

main();
