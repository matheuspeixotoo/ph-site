document.addEventListener("DOMContentLoaded", () => {
  const SHEET_ID =
    "2PACX-1vQG7xPPn-bd5_AUSvYfywduL3bquyp1PyshYGCjkIsNejft-8CmLeECG5Ih2s-zodDGctv9glmS19jd";
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;

  fetch(SHEET_URL)
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").slice(1); // Ignora cabeçalho
      const products = rows.map((row) => {
        const [marca, produto, preco, imagem, sabor] = row.split(",");
        return { marca, produto, preco, imagem, sabor };
      });

      const elfbarProducts = products.filter(
        (p) => p.marca.trim().toLowerCase() === "elfbar"
      );

      const container = document.querySelector(".product-container");
      container.innerHTML = ""; // Limpa os cards antigos

      elfbarProducts.forEach((prod) => {
        const card = createProductCard(
          prod.produto,
          prod.preco,
          prod.imagem,
          prod.sabor
        );
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar a planilha:", error);
    });
});

function createProductCard(produto, preco, imagem, sabores) {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = imagem;
  img.alt = produto;

  const info = document.createElement("div");
  info.className = "product-info";

  const title = document.createElement("h2");
  title.textContent = `${produto} - ${preco}`;

  const ul = document.createElement("ul");
  sabores.split(",").forEach((sabor) => {
    const li = document.createElement("li");
    li.textContent = sabor.trim();
    ul.appendChild(li);
  });

  info.appendChild(title);
  info.appendChild(ul);
  card.appendChild(img);
  card.appendChild(info);

  return card;
}
