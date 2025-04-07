document.addEventListener("DOMContentLoaded", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/19-10J3hzmvWuBKxFDoM6mcpkbT1jKFxl6CMIhNPeRFE/gviz/tq?tqx=out:csv";

  Papa.parse(sheetURL, {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;
      const container = document.getElementById("product-container");

      data.forEach((item) => {
        if (
          item["Marca"] &&
          item["Produto"] &&
          item["Preço"] &&
          item["Imagem"] &&
          item["Sabor"]
        ) {
          const card = document.createElement("div");
          card.className = "product-card";

          const image = document.createElement("img");
          image.src = item["Imagem"];
          image.alt = item["Produto"];

          const info = document.createElement("div");
          info.className = "product-info";

          const title = document.createElement("h2");
          title.textContent = `${item["Produto"]} - R$${item["Preço"]}`;

          const flavorList = document.createElement("ul");
          const sabores = item["Sabor"].split(",").map((s) => s.trim());
          sabores.forEach((sabor) => {
            const li = document.createElement("li");
            li.textContent = sabor;
            flavorList.appendChild(li);
          });

          info.appendChild(title);
          info.appendChild(flavorList);
          card.appendChild(image);
          card.appendChild(info);
          container.appendChild(card);
        }
      });
    },
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
