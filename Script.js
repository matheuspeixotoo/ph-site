document.addEventListener("DOMContentLoaded", function () {
  const sheetID =
    "2PACX-1vQG7xPPn-bd5_AUSvYfywduL3bquyp1PyshYGCjkIsNejft-8CmLeECG5Ih2s-zodDGctv9glmS19jd";
  const sheetURL = `https://docs.google.com/spreadsheets/d/e/${sheetID}/pub?output=csv`;

  fetch(sheetURL)
    .then((res) => res.text())
    .then((csvText) => {
      const data = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      const currentPage = document.title.toUpperCase();
      const productContainer = document.querySelector(".product-container");

      data.forEach((item) => {
        if (item.Marca.toUpperCase() === currentPage) {
          const card = document.createElement("div");
          card.className = "product-card";

          card.innerHTML = `
              <img src="${item.Imagem}" alt="${item.Produto}" />
              <div class="product-info">
                <h2>${item.Produto} - R$${item.Preço}</h2>
                <ul>
                  ${item.Sabor.split(";")
                    .map((sabor) => `<li>${sabor.trim()}</li>`)
                    .join("")}
                </ul>
              </div>
            `;

          productContainer.appendChild(card);
        }
      });
    })
    .catch((err) => console.error("Erro ao carregar a planilha:", err));
});
