document.addEventListener("DOMContentLoaded", function () {
  const sheetID = "19-10J3hzmvWuBKxFDoM6mcpkbT1jKFxl6CMIhNPeRFE";
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv`;

  fetch(sheetURL)
    .then((response) => response.text())
    .then((csvData) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const products = results.data;

          // Filtro para apenas os produtos da ELFBAR
          const elfbarProducts = products.filter(
            (p) => p.Marca.trim().toLowerCase() === "elfbar"
          );

          const container = document.querySelector(".product-container");
          container.innerHTML = ""; // Limpa os antigos

          elfbarProducts.forEach((prod) => {
            const card = createProductCard(
              prod.Produto,
              prod.Preço,
              prod.Imagem,
              prod.Sabor
            );
            container.appendChild(card);
          });
        },
      });
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
  title.textContent = `${produto} - R$ ${preco}`;

  const saborList = document.createElement("ul");
  sabores.split(",").forEach((sabor) => {
    const li = document.createElement("li");
    li.textContent = sabor.trim();
    saborList.appendChild(li);
  });

  info.appendChild(title);
  info.appendChild(saborList);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}
