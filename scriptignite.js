const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQKZXxrZJ45cmYrlNW2c06fxTZ9v8wKEJjNvj06zfP1g4Z3i9kbZ5raOw8aDWqo5jyChd7pg9tAEw3/pub?gid=997013394&single=true&output=csv";

fetch(url)
  .then((response) => response.text())
  .then((csv) => {
    const linhas = csv.trim().split("\n").slice(1); // Ignora cabeçalho
    const container = document.getElementById("produtos");

    linhas.forEach((linha) => {
      const [sabor, preco, imagem] = linha.split(",");
      const precoLimpo = preco.replace(/"/g, ""); // Remove aspas

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="assets/${imagem.trim()}" alt="${sabor}" />
        <h2>${sabor} - R$ ${precoLimpo}</h2>
        <p>${imagem.trim()}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Erro ao carregar dados:", error);
  });
