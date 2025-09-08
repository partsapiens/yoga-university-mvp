const state = { total: 0, page: 1, pages: [], toc: [] };

const $ = (id) => document.getElementById(id);
const pageEl = $("page");
const input = $("pageInput");
const totalEl = $("pageTotal");
const prevBtn = $("prevBtn");
const nextBtn = $("nextBtn");
const tocEl = $("toc");

const hashPage = () => {
  const m = location.hash.match(/p=(\d+)/);
  return m ? Math.max(1, parseInt(m[1], 10)) : 1;
};

async function init() {
  const res = await fetch("./manifest.json");
  const manifest = await res.json();
  state.total = manifest.totalPages;
  state.pages = manifest.pages; // ["page_001.html", ...]
  state.toc   = manifest.toc || []; // optional [{title, page}]
  state.page = Math.min(Math.max(hashPage(), 1), state.total);

  totalEl.textContent = `/ ${state.total}`;
  input.min = 1; input.max = state.total; input.value = state.page;

  buildTOC();
  render(state.page);
  bind();
}

function buildTOC() {
  if (!state.toc.length) { tocEl.innerHTML = ""; return; }
  tocEl.innerHTML = state.toc.map(
    (t) => `<a href="#p=${t.page}" data-p="${t.page}">${escapeHtml(t.title)}</a>`
  ).join("");
}

function bind() {
  window.addEventListener("hashchange", () => {
    const p = hashPage();
    if (p !== state.page) render(p);
  });

  prevBtn.addEventListener("click", () => go(state.page - 1));
  nextBtn.addEventListener("click", () => go(state.page + 1));
  input.addEventListener("change", () => go(parseInt(input.value || "1", 10)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(state.page - 1);
    if (e.key === "ArrowRight") go(state.page + 1);
  });

  tocEl.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-p]");
    if (!a) return;
    e.preventDefault();
    go(parseInt(a.dataset.p, 10));
  });
}

async function render(p) {
  const page = clamp(p, 1, state.total);
  state.page = page;

  // update UI
  input.value = String(page);
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= state.total;
  highlightTOC(page);

  // fetch and inject the HTML for this page
  const file = state.pages[page - 1] || `page_${String(page).padStart(3, "0")}.html`;
  const res = await fetch(`./pages/${file}`, { cache: "force-cache" });
  const html = await res.text();
  pageEl.innerHTML = html;

  // prefetch neighbors
  prefetch(page + 1);
  prefetch(page - 1);

  // keep hash synced
  if (location.hash !== `#p=${page}`) history.replaceState(null, "", `#p=${page}`);
}

function prefetch(p) {
  if (p < 1 || p > state.total) return;
  const f = state.pages[p - 1] || `page_${String(p).padStart(3, "0")}.html`;
  fetch(`./pages/${f}`, { cache: "force-cache" }).catch(() => {});
}

function go(p) {
  render(p);
}

function highlightTOC(page) {
  if (!state.toc.length) return;
  tocEl.querySelectorAll("a").forEach(a => {
    a.classList.toggle("active", parseInt(a.dataset.p, 10) === page);
  });
}

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[c])); }

init();
