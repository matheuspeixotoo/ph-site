# Catálogo Over Pods — redesign

Site de catálogo de pods, essências e acessórios. Pedidos fechados pelo WhatsApp, sem carrinho nem pagamento.

🔗 [www.phpods.com.br](https://www.phpods.com.br)

---

## Como funciona

- **Não existe banco de dados.** Todo o catálogo (produtos, preços, fotos e sabores) vem de uma planilha do Google publicada na web em CSV, exatamente como na versão anterior do site. O dono da loja continua editando só a planilha.
- **Uma aba da planilha por marca.** Cada aba tem as colunas `Marca`, `Produto`, `Preço`, `Imagem`, `Sabor`. Os sabores vão na mesma célula, separados por vírgula ou quebra de linha.
- **A aba NOVIDADES alimenta a home.** Os três primeiros produtos dela viram os cards de "Lançamentos", e qualquer produto que também esteja nela ganha o selo **Novo** na página da marca e o filtro "Lançamentos".
- **Fotos** ficam em `Assets/` e a planilha referencia só o nome do arquivo (ex.: `elfbar40k.jpg`). Se a foto não existir, o card mostra um placeholder em vez de imagem quebrada.
- **Age gate** (18+) aparece antes de qualquer conteúdo e o aceite vale 30 dias no navegador.
- **Busca** no cabeçalho procura em todas as marcas por sabor, modelo ou marca e mostra só os sabores que batem com o termo.
- **Cada sabor é um link** que abre o WhatsApp com a mensagem pronta ("Olá! Quero o ELFBAR 40MIL sabor Grape Ice.").

## Estrutura

```
index.html          home (lançamentos, marcas, essências e acessórios)
<marca>.html        uma página por marca — mesmos nomes de arquivo do site antigo,
                    então os links já divulgados continuam valendo
catalogo.js         CONFIGURAÇÃO: número do WhatsApp, planilha, lista de marcas e gids
app.js              aplicação (carrega a planilha, renderiza, busca, filtros, age gate)
styles.css          tokens e componentes (design system Nocturne)
tools/gerar-paginas.py  gera index.html e as páginas de marca a partir de catalogo.js
Assets/             fotos de produto, logos das marcas, banner
CNAME               domínio do GitHub Pages
```

## Testar no computador

Abrir o `index.html` com dois cliques **não carrega o catálogo**: no endereço `file://` o Google bloqueia a leitura da planilha (o site antigo tem a mesma limitação). Dê dois cliques em `tools/servir.bat`, que sobe um servidor local e abre `http://localhost:8000`. No GitHub Pages funciona normalmente.

## Tarefas comuns

**Trocar o número do WhatsApp ou as mensagens prontas** → edite `catalogo.js`.

**Adicionar uma marca**
1. Crie a aba na planilha (mesmas colunas) e publique.
2. Pegue o `gid` da aba na URL da planilha.
3. Adicione a marca em `catalogo.js` (slug, nome, gid, logo, tipo `pod` ou `extra`).
4. Coloque o logo em `Assets/` (PNG com fundo transparente; ele é exibido em monocromático claro).
5. Rode `python tools/gerar-paginas.py` para criar a página `slug.html`.

**Remover uma marca** → apague a entrada em `catalogo.js`, rode o gerador e apague o `.html` antigo.

**Trocar o banner de aviso** → substitua `Assets/banner.jpeg` (ou mude o nome em `catalogo.js`; deixe `""` para desativar).

**Horário de atendimento no rodapé** → preencha `horario` em `catalogo.js`.

## Tecnologias

HTML, CSS e JavaScript puros. A única dependência externa é o [PapaParse](https://www.papaparse.com/) (leitura do CSV), via CDN, e a fonte Inter do Google Fonts. Sem build, sem framework: basta publicar a pasta no GitHub Pages.

## Autor

Desenvolvido por [Matheus Peixoto](https://github.com/matheuspeixotoo).
