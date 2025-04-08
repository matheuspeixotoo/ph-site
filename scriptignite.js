document.addEventListener("DOMContentLoaded", () => {
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQKZXxrZJ45cmYrlNW2c06fxTZ9v8wKEJjNvj06zfP1g4Z3i9kbZ5raOw8aDWqo5jyChd7pg9tAEw3/pub?gid=997013394&single=true&output=csv";
  const container = document.querySelector(".product-container");

  fetch(csvUrl)
    .then((response) => response.text())
    .then((csvText) => {
      const rows = csvText.split("\n").slice(1); // ignora cabeçalho
      rows.forEach((row) => {
        const [marca, produto, preco, imagem, sabor] = row.split(",");

        // Evita processar linhas vazias
        if (!produto || !preco || !imagem || !sabor) return;

        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <img src="${imagem.trim()}" alt="${produto.trim()}" />
            <div class="product-info">
              <h2>${produto.trim()} - ${preco.trim()}</h2>
              <ul>
                ${sabor
                  .split(";")
                  .map((s) => `<li>${s.trim()}</li>`)
                  .join("")}
              </ul>
            </div>
          `;

        container.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar os dados:", error);
    });
});
