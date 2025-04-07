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
          const data = results.data;
          const container = document.getElementById("product-container");

          // Filtra apenas produtos da marca ELFBAR
          const elfbarProducts = data.filter(
            (item) => item.Marca && item.Marca.toLowerCase() === "elfbar"
          );

          elfbarProducts.forEach((item) => {
            const card = document.createElement("div");
            card.className = "product-card";

            // Criação da imagem
            const img = document.createElement("img");
            img.src = item.Imagem;
            img.alt = item.Produto;
            card.appendChild(img);

            // Informações do produto
            const info = document.createElement("div");
            info.className = "product-info";

            const title = document.createElement("h2");
            title.textContent = `${item.Produto} - R$${item.Preço}`;
            info.appendChild(title);

            // Lista de sabores
            const ul = document.createElement("ul");
            if (item.Sabor) {
              const sabores = item.Sabor.split(",").map((s) => s.trim());
              sabores.forEach((sabor) => {
                const li = document.createElement("li");
                li.textContent = sabor;
                ul.appendChild(li);
              });
            }

            info.appendChild(ul);
            card.appendChild(info);
            container.appendChild(card);
          });
        },
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar a planilha:", error);
    });
});
