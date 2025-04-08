const spreadsheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQKZXxrZJ45cmYrlNW2c06fxTZ9v8wKEJjNvj06zfP1g4Z3i9kbZ5raOw8aDWqo5jyChd7pg9tAEw3/pub?gid=0&single=true&output=csv";

fetch(spreadsheetURL)
  .then((response) => response.text())
  .then((csvText) => {
    const data = Papa.parse(csvText, { header: true }).data;
    const container = document.getElementById("product-container");

    // Filtra só produtos ELFBAR
    const elfbarProducts = data.filter(
      (item) => item.Marca?.trim().toUpperCase() === "ELFBAR"
    );

    // Agrupa produtos por nome + imagem + preço
    const agrupados = {};

    elfbarProducts.forEach((item) => {
      const key = `${item.Produto}|${item.Preço}|${item.Imagem}`;
      if (!agrupados[key]) {
        agrupados[key] = {
          nome: item.Produto,
          preco: item.Preço,
          imagem: item.Imagem,
          sabores: [],
        };
      }

      if (item.Sabor) {
        const saboresSeparados = item.Sabor.split(",").map((s) => s.trim());
        agrupados[key].sabores.push(...saboresSeparados);
      }
    });

    // Cria os cards no HTML
    Object.values(agrupados).forEach((produto) => {
      const card = document.createElement("div");
      card.className = "product-card";

      const imagem = document.createElement("img");
      imagem.src = `./Assets/${produto.imagem}`;
      imagem.alt = produto.nome;

      const info = document.createElement("div");
      info.className = "product-info";

      const precoFormatado = `R$${parseFloat(produto.preco)
        .toFixed(2)
        .replace(".", ",")}`;
      const titulo = document.createElement("h2");
      titulo.textContent = `${produto.nome} - ${precoFormatado}`;

      const listaSabores = document.createElement("ul");
      const saboresUnicos = [...new Set(produto.sabores)];

      saboresUnicos.forEach((sabor) => {
        const li = document.createElement("li");
        li.textContent = sabor;
        listaSabores.appendChild(li);
      });

      info.appendChild(titulo);
      info.appendChild(listaSabores);
      card.appendChild(imagem);
      card.appendChild(info);
      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Erro ao carregar os dados:", error));
