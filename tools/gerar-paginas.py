# -*- coding: utf-8 -*-
"""Gera index.html e uma página por marca a partir de catalogo.js.
Rode depois de adicionar/remover uma marca:  python tools/gerar-paginas.py
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
cfg = (ROOT / "catalogo.js").read_text(encoding="utf-8")

def campo(bloco, chave):
    m = re.search(r'%s:\s*"([^"]*)"' % chave, bloco)
    return m.group(1) if m else ""

marcas = [(campo(b, "slug"), campo(b, "nome")) for b in re.findall(r"\{[^{}]*slug:[^{}]*\}", cfg)]
nov = re.search(r"novidades:\s*(\{[^}]*\})", cfg).group(1)
paginas = [(campo(nov, "slug"), campo(nov, "nome"))] + [m for m in marcas if m[0] != campo(nov, "slug")]

TEMPLATE = """<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
    <meta name="theme-color" content="#161826" />
    <link rel="icon" type="image/png" href="Assets/logo_overpods_icon.webp" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="styles.css" />
    <script>
      // Age gate: decide antes da primeira pintura se o overlay aparece (aceite vale 30 dias).
      try {{
        var t = +localStorage.getItem("ph_age_ok") || 0;
        if (t && Date.now() - t < 30 * 24 * 60 * 60 * 1000) document.documentElement.classList.add("age-ok");
      }} catch (e) {{}}
    </script>
  </head>
  <body data-page="{page}"{brand_attr}>
    <div id="gate" class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div class="gate-dialog">
        <span class="kicker">Verificação de idade</span>
        <h2 id="gate-title">Você tem 18 anos ou mais?</h2>
        <p>Este catálogo exibe produtos que contêm nicotina. A venda é proibida para menores de 18 anos.</p>
        <div class="gate-actions">
          <button type="button" class="btn btn-primary" data-gate-yes>Sim, tenho 18 anos ou mais</button>
          <button type="button" class="btn btn-secondary" data-gate-no>Sou menor de 18 anos</button>
        </div>
      </div>
    </div>

    <header id="site-header" class="site-header"></header>
    <main id="main"></main>
    <footer id="site-footer" class="site-footer"></footer>

    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
    <script src="catalogo.js"></script>
    <script src="app.js"></script>
  </body>
</html>
"""

def escrever(nome, **kw):
    (ROOT / nome).write_text(TEMPLATE.format(**kw), encoding="utf-8", newline="\n")
    print("ok", nome)

escrever("index.html", title="Over Pods · Catálogo de pods e essências", page="home", brand_attr="",
         desc="Catálogo de pods, essências e acessórios. Pedidos pelo WhatsApp.")
for slug, nome in paginas:
    escrever(slug + ".html", title=f"{nome} · Over Pods", page="brand", brand_attr=f' data-brand="{slug}"',
             desc=f"{nome}: modelos, preços e sabores em estoque. Pedidos pelo WhatsApp.")
