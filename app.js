/* ============================================================
   Over Pods — aplicação
   Lê a configuração em catalogo.js, busca as abas da planilha
   (CSV publicado) e renderiza home, página de marca e busca.
   Sem build, sem framework, sem banco de dados.
   ============================================================ */
(function () {
  "use strict";

  const CFG = window.PH_CONFIG;
  const page = document.body.dataset.page || "home"; // "home" | "brand"
  const pageSlug = document.body.dataset.brand || "";

  /* ---------- ícones (Phosphor, regular) ---------- */
  const ICON = {
    whatsapp:
      '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M152.58,145.23l23,11.48A24,24,0,0,1,152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155ZM232,128A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-40,24a8,8,0,0,0-4.42-7.16l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88A40,40,0,0,0,192,152Z"/></svg>',
    search:
      '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>',
    back:
      '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>',
    x:
      '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" width="14" height="14"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
  };

  /* ---------- utilidades ---------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fold = (s) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const clean = (s) =>
    String(s ?? "")
      .replace(/[\u2060\u200b\u00a0]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const titleCase = (s) =>
    clean(s)
      .toLowerCase()
      .replace(/(^|[\s\-\/+(])([a-zà-ú])/g, (m, p, c) => p + c.toUpperCase());

  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

  const waLink = (text) => `https://wa.me/${CFG.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const waGeral = waLink(CFG.msgGeral);
  const waProduto = (p) => waLink(CFG.msgProduto.replace("{produto}", p.nome));
  const waSabor = (p, sabor) => waLink(CFG.msgSabor.replace("{produto}", p.nome).replace("{sabor}", sabor));

  function parsePreco(raw) {
    const s = clean(raw).replace(/[R$\s]/g, "");
    if (!s) return null;
    const n = parseFloat(s.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  const fmtPreco = (n) => (n == null ? "" : "R$ " + n.toFixed(2).replace(".", ","));

  const RX_GELADO = /\b(ice|icy|iced|gelad\w*|menta|mint|minty|menthol|chill|frost|frozen|freeze|arctic)\b/i;
  const RX_FRUTADO =
    /(berry|berries|fruta|fruit|uva|grape|manga|mango|melanc|watermelon|melon|morango|strawberry|straw|p[êe]ssego|peach|abacaxi|pineapple|kiwi|goiaba|guava|maracuj[áa]|passion|lichia|lychee|ma[çc][ãa]|apple|cereja|cherry|lim[ãa]o|lemon|limonada|lemonade|banana|a[çc]a[íi]|orange|laranja|dragon|coconut|coco|pear|pera|plum|pomegranate|grapefruit|tropical|cranberry|raspberry|razz|blueberry|blackberry)/i;

  const IS_FILE = location.protocol === "file:";
  const ERRO_CATALOGO = IS_FILE
    ? `<div class="notice">Este arquivo foi aberto direto do disco (<code>file://</code>), e nesse modo o navegador bloqueia a leitura da planilha do Google — o mesmo acontece com a versão antiga do site. No GitHub Pages funciona normalmente. Para testar no computador, dê dois cliques em <code>tools/servir.bat</code> (ou rode <code>python -m http.server 8000</code> na pasta) e abra <code>http://localhost:8000</code>.</div>`
    : `<p class="state-msg">Não foi possível carregar o catálogo. Tente de novo em instantes ou fale com a gente no WhatsApp.</p>`;

  const BRANDS = CFG.marcas;
  const NOVIDADES = CFG.novidades;
  const brandBySlug = (slug) => (slug === NOVIDADES.slug ? NOVIDADES : BRANDS.find((b) => b.slug === slug));

  /* ---------- dados ---------- */
  const memo = {};
  const CACHE_TTL = 10 * 60 * 1000;

  function parseCsv(text, brand) {
    const rows = Papa.parse(text, { header: true, skipEmptyLines: "greedy" }).data;
    const out = [];
    const seen = new Set();
    rows.forEach((r) => {
      const nome = clean(r.Produto);
      if (!nome) return;
      const key = fold(nome) + "|" + clean(r.Imagem);
      const saboresBrutos = String(r.Sabor ?? "")
        .split(/[,\n]/)
        .map(clean)
        .filter((s) => s.length > 1);
      const sabores = [];
      const vistos = new Set();
      saboresBrutos.forEach((s) => {
        const k = fold(s);
        if (!vistos.has(k)) {
          vistos.add(k);
          sabores.push(titleCase(s));
        }
      });
      if (seen.has(key)) {
        // linha repetida do mesmo produto: só agrega sabores
        const p = out.find((x) => x.key === key);
        sabores.forEach((s) => { if (!p.sabores.some((x) => fold(x) === fold(s))) p.sabores.push(s); });
        return;
      }
      seen.add(key);
      out.push({
        key,
        brandSlug: brand.slug,
        brandNome: brand.nome,
        nome,
        preco: parsePreco(r.Preço ?? r["Preço"] ?? r.Preco),
        imagem: clean(r.Imagem),
        sabores,
      });
    });
    return out;
  }

  function loadTab(brand) {
    if (memo[brand.slug]) return memo[brand.slug];
    const cacheKey = "ph_tab_" + brand.gid;
    memo[brand.slug] = (async () => {
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
        if (cached && Date.now() - cached.t < CACHE_TTL) return parseCsv(cached.csv, brand);
      } catch (_) { /* sem cache */ }
      const res = await fetch(CFG.planilha + brand.gid, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const csv = await res.text();
      try { sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), csv })); } catch (_) { /* cheio */ }
      return parseCsv(csv, brand);
    })();
    return memo[brand.slug];
  }

  let novidadesKeys = null;
  let novidadesErro = false;
  async function loadNovidades() {
    const items = await loadTab(NOVIDADES).catch(() => { novidadesErro = true; return []; });
    novidadesKeys = new Set();
    items.forEach((p) => {
      novidadesKeys.add(fold(p.nome));
      if (p.imagem) novidadesKeys.add("img:" + fold(p.imagem));
    });
    return items;
  }
  const isNew = (p) =>
    !!novidadesKeys && (novidadesKeys.has(fold(p.nome)) || (p.imagem && novidadesKeys.has("img:" + fold(p.imagem))));

  async function loadAll() {
    const [nov, ...lists] = await Promise.all([
      loadNovidades(),
      ...BRANDS.map((b) => loadTab(b).catch(() => null)),
    ]);
    const byBrand = {};
    BRANDS.forEach((b, i) => { byBrand[b.slug] = lists[i]; }); // null = erro ao carregar
    return { novidades: nov, byBrand };
  }

  // Descobre a marca de um lançamento pelo nome do produto (ex.: "IGNITE V500" → ignite).
  function guessBrand(p) {
    const n = fold(p.nome);
    const hit = BRANDS.filter((b) => b.tipo === "pod").find((b) => n.startsWith(fold(b.nome)) || n.includes(fold(b.nome)));
    return hit ? hit.slug + ".html" : NOVIDADES.slug + ".html";
  }

  /* ---------- casca: header, footer, fab ---------- */
  function renderChrome() {
    const header = document.getElementById("site-header");
    header.innerHTML = `
      <div class="container">
        <a class="brand-link" href="index.html" aria-label="Over Pods, início">
          <img class="brand-mark" src="Assets/logo_overpods_icon.png" alt="" aria-hidden="true" />
          <span class="brand-name">Over Pods</span>
        </a>
        <form class="search" role="search" onsubmit="return false">
          ${ICON.search}
          <label class="visually-hidden" for="q">Buscar no catálogo</label>
          <input id="q" type="search" autocomplete="off" placeholder="Buscar sabor, marca ou modelo" />
          <button type="button" class="search-clear" aria-label="Limpar busca">${ICON.x}</button>
        </form>
        <a class="btn btn-primary header-wa" href="${waGeral}" target="_blank" rel="noopener">${ICON.whatsapp}<span>WhatsApp</span></a>
      </div>`;

    document.getElementById("site-footer").innerHTML = `
      <div class="container">
        <div>
          <div class="footer-brand">Over Pods</div>
          <p>Catálogo de pods, essências e acessórios. Atendimento e pedidos pelo WhatsApp.</p>
        </div>
        <div>
          <div class="footer-label">Atendimento</div>
          <a href="${waGeral}" target="_blank" rel="noopener">WhatsApp</a>
          ${CFG.horario ? `<div class="muted">${esc(CFG.horario)}</div>` : ""}
        </div>
        <div>
          <div class="footer-label">Aviso legal</div>
          <p>Produto destinado a maiores de 18 anos. Contém nicotina, substância que causa dependência.</p>
        </div>
      </div>`;

    const fab = document.createElement("a");
    fab.className = "wa-fab";
    fab.href = waGeral;
    fab.target = "_blank";
    fab.rel = "noopener";
    fab.setAttribute("aria-label", "Falar no WhatsApp");
    fab.innerHTML = ICON.whatsapp;
    document.body.appendChild(fab);
  }

  /* ---------- age gate ---------- */
  function setupGate() {
    const gate = document.getElementById("gate");
    if (!gate) return;
    gate.querySelector("[data-gate-yes]").addEventListener("click", () => {
      try { localStorage.setItem("ph_age_ok", String(Date.now())); } catch (_) { /* privado */ }
      document.documentElement.classList.add("age-ok");
      maybeShowBanner();
    });
    gate.querySelector("[data-gate-no]").addEventListener("click", () => {
      gate.innerHTML = `
        <div class="gate-blocked" role="alert">
          <div>
            <h2>Acesso restrito</h2>
            <p>Nosso catálogo é destinado exclusivamente a maiores de 18 anos.</p>
          </div>
        </div>`;
    });
  }

  function maybeShowBanner() {
    if (page !== "home" || !CFG.banner) return;
    try { if (sessionStorage.getItem("ph_banner_seen")) return; } catch (_) { /* segue */ }
    const el = document.createElement("div");
    el.className = "banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Aviso");
    el.innerHTML = `
      <div class="banner-dialog">
        <img src="Assets/${esc(CFG.banner)}" alt="Aviso da loja" />
        <button type="button" class="btn btn-primary" data-close>Fechar</button>
      </div>`;
    const close = () => { el.remove(); try { sessionStorage.setItem("ph_banner_seen", "1"); } catch (_) { /* segue */ } };
    el.querySelector("[data-close]").addEventListener("click", close);
    el.addEventListener("click", (e) => { if (e.target === el) close(); });
    document.body.appendChild(el);
  }

  /* ---------- componentes ---------- */
  function photoHtml(p, extra) {
    const cap = "sem foto";
    if (!p.imagem) {
      return `<div class="photo is-placeholder"><span class="photo-caption">${cap}</span>${extra || ""}</div>`;
    }
    return `<div class="photo">
      <img src="Assets/${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy"
           onerror="this.parentNode.classList.add('is-placeholder')" />
      <span class="photo-caption">${cap}</span>${extra || ""}
    </div>`;
  }

  // Registro dos produtos renderizados, para o clique no sabor achar o produto do card.
  const REG = {};
  const regKey = (p) => p.brandSlug + "|" + p.key;

  function productCard(p, opts) {
    opts = opts || {};
    REG[regKey(p)] = p;
    const hits = opts.hits || null; // sabores em destaque (busca / filtro)
    let sabores = p.sabores;
    if (opts.onlyHits && hits && hits.size) sabores = sabores.filter((s) => hits.has(fold(s)));
    const collapsed = sabores.length > 8 ? " is-collapsed" : "";
    const chips = sabores
      .map((s) => `<li><button type="button" class="flavor${hits && hits.has(fold(s)) ? " is-hit" : ""}" data-sabor="${esc(s)}" aria-pressed="false">${esc(s)}</button></li>`)
      .join("");
    const more = collapsed
      ? `<li class="flavors-more"><button type="button" data-more>+${sabores.length - 8} sabores</button></li>`
      : "";
    const badge = isNew(p) ? `<span class="tag">Novo</span>` : "";
    let meta = sabores.length ? plural(sabores.length, "sabor", "sabores") : "Consulte os sabores no WhatsApp";
    if (sabores.length && sabores.length < p.sabores.length) meta = `${sabores.length} de ${plural(p.sabores.length, "sabor", "sabores")}`;
    return `
      <article class="card" data-reg="${esc(regKey(p))}">
        ${photoHtml(p, badge)}
        <div class="card-body">
          ${opts.kicker ? `<div class="card-kicker">${esc(p.brandNome)}</div>` : ""}
          <h3 class="card-name">${esc(p.nome)}</h3>
          ${p.preco != null ? `<div class="card-price">${fmtPreco(p.preco)}</div>` : ""}
          <div class="card-meta" data-meta-base="${esc(meta)}">${meta}</div>
          ${sabores.length ? `<ul class="flavors${collapsed}">${chips}${more}</ul>` : ""}
          <div class="card-actions">
            <a class="btn btn-primary btn-block" href="${waProduto(p)}" target="_blank" rel="noopener">${ICON.whatsapp}<span data-cta>Pedir no WhatsApp</span></a>
          </div>
        </div>
      </article>`;
  }

  // Um sabor selecionado por card. Clicar de novo desmarca. O link do botão acompanha.
  function selectFlavor(card, chip) {
    const p = REG[card.dataset.reg];
    const meta = card.querySelector(".card-meta");
    const cta = card.querySelector("[data-cta]");
    const link = card.querySelector(".card-actions .btn");
    const was = chip.classList.contains("is-selected");
    card.querySelectorAll(".flavor.is-selected").forEach((c) => { c.classList.remove("is-selected"); c.setAttribute("aria-pressed", "false"); });
    if (was) {
      link.href = waProduto(p);
      meta.textContent = meta.dataset.metaBase;
      meta.classList.remove("is-pick");
      cta.textContent = "Pedir no WhatsApp";
      return;
    }
    chip.classList.add("is-selected");
    chip.setAttribute("aria-pressed", "true");
    const sabor = chip.dataset.sabor;
    link.href = waSabor(p, sabor);
    meta.textContent = "Sabor escolhido: " + sabor;
    meta.classList.add("is-pick");
    cta.textContent = "Pedir sabor no WhatsApp";
  }

  function bindCards(root) {
    root.querySelectorAll("[data-more]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ul = btn.closest(".flavors");
        ul.classList.remove("is-collapsed");
        btn.closest("li").remove();
      });
    });
    root.querySelectorAll(".flavor[data-sabor]").forEach((chip) => {
      chip.addEventListener("click", () => selectFlavor(chip.closest(".card"), chip));
    });
  }

  /* ---------- home ---------- */
  function renderHome(main) {
    const podBrands = BRANDS.filter((b) => b.tipo === "pod");
    const extras = BRANDS.filter((b) => b.tipo === "extra");
    main.innerHTML = `
      <section class="container hero">
        <div class="hero-copy">
          <h1>O catálogo completo de pods e essências, curado marca por marca.</h1>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="${waGeral}" target="_blank" rel="noopener">${ICON.whatsapp}Falar no WhatsApp</a>
            <a class="btn btn-lg" href="#lancamentos">Ver lançamentos</a>
          </div>
        </div>
        <img class="hero-art" src="Assets/logo_overpods.png" alt="Over Pods" />
      </section>

      <section class="container section" id="lancamentos">
        <div class="rule"></div>
        <div class="section-head">
          <h2>Lançamentos</h2>
          <a class="meta" href="${NOVIDADES.slug}.html" id="nov-link">Ver todos</a>
        </div>
        <div class="grid-features" id="features"><p class="state-msg">Carregando lançamentos…</p></div>
      </section>

      <section class="container section" id="marcas">
        <div class="rule"></div>
        <div class="section-head">
          <h2>Marcas</h2>
          <span class="meta" id="brand-count">${plural(podBrands.length, "marca", "marcas")}</span>
        </div>
        <div class="grid-brands">
          ${podBrands.map((b) => `
            <a class="brand-card" href="${b.slug}.html" data-brand-card="${b.slug}">
              <img class="brand-logo" src="Assets/${esc(b.logo)}" alt="" aria-hidden="true" onerror="this.remove()" />
              <span class="brand-card-text">
                <span class="brand-card-name">${esc(b.nome)}</span>
                <span class="brand-card-meta" data-meta>…</span>
              </span>
            </a>`).join("")}
        </div>
      </section>

      <section class="container section">
        <div class="rule"></div>
        <div class="section-head"><h2>Essências e acessórios</h2></div>
        <div class="chips">
          ${extras.map((b) => `<a class="chip" href="${b.slug}.html" data-brand-card="${b.slug}">${esc(b.nome)} <small data-meta></small></a>`).join("")}
        </div>
      </section>`;

    loadAll().then(({ novidades, byBrand }) => {
      // lançamentos em destaque
      const feats = document.getElementById("features");
      const top = novidades.slice(0, CFG.destaquesNaHome);
      if (novidadesErro) {
        feats.innerHTML = ERRO_CATALOGO;
      } else if (!top.length) {
        feats.innerHTML = `<p class="state-msg">Nenhum lançamento cadastrado nesta semana.</p>`;
      } else {
        feats.innerHTML = top.map((p, i) => {
          const sub = [p.sabores.length ? plural(p.sabores.length, "sabor", "sabores") : "", fmtPreco(p.preco)].filter(Boolean).join(" · ");
          return `
            <a class="feature" href="${guessBrand(p)}" style="animation-delay:${i * 60}ms">
              ${photoHtml(p, `<span class="tag">${i < 2 ? "Lançamento" : "Novidade"}</span>`)}
              <span class="feature-body">
                <span class="feature-title">${esc(p.nome)}</span>
                <span class="feature-sub">${esc(sub)}</span>
              </span>
            </a>`;
        }).join("");
      }
      document.getElementById("nov-link").textContent = `Ver todos · ${novidades.length}`;

      // contagem nos cards de marca
      let ativas = 0;
      BRANDS.forEach((b) => {
        const list = byBrand[b.slug];
        const el = main.querySelector(`[data-brand-card="${b.slug}"]`);
        if (!el) return;
        const meta = el.querySelector("[data-meta]");
        if (list === null) { meta.textContent = IS_FILE ? "Abra por um servidor local" : "Não foi possível carregar"; return; }
        const sabores = list.reduce((n, p) => n + p.sabores.length, 0);
        if (!list.length) { meta.textContent = "Sem estoque no momento"; el.classList.add("is-empty"); return; }
        if (b.tipo === "pod") ativas++;
        meta.textContent = b.tipo === "pod"
          ? `${plural(list.length, "modelo", "modelos")} · ${plural(sabores, "sabor", "sabores")}`
          : plural(list.length, "item", "itens");
      });
      document.getElementById("brand-count").textContent = `${plural(ativas, "marca", "marcas")} em estoque · atualizado hoje`;
    }).catch(() => {
      document.getElementById("features").innerHTML = ERRO_CATALOGO;
    });
  }

  /* ---------- página de marca ---------- */
  function renderBrand(main) {
    const brand = brandBySlug(pageSlug);
    if (!brand) { main.innerHTML = `<section class="container page-head"><p class="state-msg">Marca não encontrada.</p></section>`; return; }
    const isNov = brand.slug === NOVIDADES.slug;
    document.title = `${brand.nome} · Over Pods`;
    const descricao = brand.descricao || (isNov
      ? "Os produtos que chegaram por último. Confirme a disponibilidade no WhatsApp antes de fechar o pedido."
      : "Modelos e sabores em estoque. Confirme o sabor no WhatsApp antes de fechar o pedido.");

    main.innerHTML = `
      <section class="container page-head">
        <a class="back-link" href="index.html">${ICON.back} Todas as marcas</a>
        <div class="page-title-row">
          <div>
            <h1>${esc(brand.nome)}</h1>
            <p>${esc(descricao)}</p>
          </div>
          <span class="meta" id="stock">…</span>
        </div>
      </section>
      <section class="container filters" id="filters" hidden></section>
      <section class="container products">
        <div class="grid-products" id="grid"><p class="state-msg">Carregando catálogo…</p></div>
      </section>`;

    const grid = document.getElementById("grid");
    const filtersEl = document.getElementById("filters");
    let items = [];
    let filter = "Todos";

    const filtersFor = () => {
      const opts = [["Todos", () => true]];
      if (!isNov) opts.push(["Lançamentos", (p) => isNew(p)]);
      opts.push(["Gelados", (p) => p.sabores.some((s) => RX_GELADO.test(s))]);
      opts.push(["Frutados", (p) => p.sabores.some((s) => RX_FRUTADO.test(s))]);
      // esconde chip que não devolve nada nesta marca
      return opts.filter(([label, fn]) => label === "Todos" || items.some(fn));
    };

    const draw = () => {
      let list = items;
      let hitsFor = null;
      if (filter === "Lançamentos") list = items.filter(isNew);
      else if (filter === "Gelados") { list = items.filter((p) => p.sabores.some((s) => RX_GELADO.test(s))); hitsFor = (p) => new Set(p.sabores.filter((s) => RX_GELADO.test(s)).map(fold)); }
      else if (filter === "Frutados") { list = items.filter((p) => p.sabores.some((s) => RX_FRUTADO.test(s))); hitsFor = (p) => new Set(p.sabores.filter((s) => RX_FRUTADO.test(s)).map(fold)); }

      if (!items.length) { grid.innerHTML = `<p class="state-msg">Nenhum item em estoque no momento. Fale com a gente no WhatsApp — o estoque muda toda semana.</p>`; return; }
      if (!list.length) { grid.innerHTML = `<p class="state-msg">Nada nesse filtro para ${esc(brand.nome)}.</p>`; return; }
      grid.innerHTML = list.map((p) => productCard(p, { hits: hitsFor ? hitsFor(p) : null, onlyHits: !!hitsFor })).join("");
      bindCards(grid);
    };

    Promise.all([loadNovidades(), loadTab(brand)]).then(([, list]) => {
      items = list;
      const sabores = items.reduce((n, p) => n + p.sabores.length, 0);
      document.getElementById("stock").textContent = items.length
        ? `${plural(items.length, "item", "itens")} · ${plural(sabores, "sabor", "sabores")}`
        : "Sem estoque no momento";
      const opts = filtersFor();
      if (opts.length > 1) {
        filtersEl.hidden = false;
        filtersEl.innerHTML = opts.map(([label]) => `<button type="button" class="filter${label === filter ? " is-active" : ""}" data-filter="${label}">${label}</button>`).join("");
        filtersEl.querySelectorAll("[data-filter]").forEach((btn) => btn.addEventListener("click", () => {
          filter = btn.dataset.filter;
          filtersEl.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
          draw();
        }));
      }
      draw();
    }).catch(() => {
      grid.innerHTML = ERRO_CATALOGO;
    });
  }

  /* ---------- busca (estado sobre qualquer página) ---------- */
  function setupSearch(main, renderPage) {
    const form = document.querySelector(".search");
    const input = document.getElementById("q");
    const clear = form.querySelector(".search-clear");
    let searching = false; // a busca substitui a página; ao limpar, a página é re-renderizada
    let timer = null;
    let seq = 0;

    const restore = () => {
      if (searching) { searching = false; renderPage(); }
    };

    const run = async (q) => {
      const my = ++seq;
      searching = true;
      main.innerHTML = `<section class="container search-results"><span class="search-label">Buscando “${esc(q)}”…</span></section>`;
      let data;
      try { data = await loadAll(); } catch (_) { data = null; }
      if (my !== seq) return;
      if (!data) { main.innerHTML = `<section class="container search-results">${ERRO_CATALOGO}</section>`; return; }

      const nq = fold(q);
      const results = [];
      BRANDS.forEach((b) => {
        (data.byBrand[b.slug] || []).forEach((p) => {
          const hits = new Set(p.sabores.filter((s) => fold(s).includes(nq)).map(fold));
          const inName = fold(p.nome).includes(nq) || fold(p.brandNome).includes(nq);
          if (hits.size || inName) results.push({ p, hits, onlyHits: hits.size > 0 && !inName });
        });
      });
      const label = `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para “${esc(q)}”`;
      main.innerHTML = `
        <section class="container search-results">
          <span class="search-label">${label}</span>
          ${results.length
            ? `<div class="grid-products">${results.map((r) => productCard(r.p, { kicker: true, hits: r.hits, onlyHits: r.onlyHits })).join("")}</div>`
            : `<p class="state-msg">Nada com esse nome no catálogo. Fale com a gente no WhatsApp — o estoque muda toda semana.</p>`}
        </section>`;
      bindCards(main);
      window.scrollTo({ top: 0 });
    };

    input.addEventListener("input", () => {
      const q = input.value.trim();
      form.classList.toggle("has-query", q.length > 0);
      clearTimeout(timer);
      timer = setTimeout(() => { if (q.length > 1) run(q); else { seq++; restore(); } }, 150);
    });
    clear.addEventListener("click", () => { input.value = ""; form.classList.remove("has-query"); seq++; restore(); input.focus(); });
    input.addEventListener("keydown", (e) => { if (e.key === "Escape") clear.click(); });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderChrome();
    setupGate();
    const main = document.getElementById("main");
    const renderPage = () => (page === "brand" ? renderBrand(main) : renderHome(main));
    renderPage();
    setupSearch(main, renderPage);
    if (document.documentElement.classList.contains("age-ok")) maybeShowBanner();
  });
})();
