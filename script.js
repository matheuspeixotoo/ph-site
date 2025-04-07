document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");

  Papa.parse(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG7xPPn-bd5_AUSvYfywduL3bquyp1PyshYGCjkIsNejft-8CmLeECG5Ih2s-zodDGctv9glmS19jd/pub?output=csv",
    {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;

        // Filtrar apenas produtos ELFBAR
        const elfbarProducts = data.filter(
          (item) => item.Marca?.trim().toUpperCase() === "ELFBAR"
        );

        // Agrupar por produto + imagem + preço
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
            const saboresIndividuais = item.Sabor.split(",").map((s) =>
              s.trim()
            );
            agrupados[key].sabores.push(...saboresIndividuais);
          }
        });

        Object.values(agrupados).forEach((produto) => {
          const card = document.createElement("div");
          card.classList.add("product-card");

          const image = document.createElement("img");
          image.src = `./Assets/${produto.imagem}`;
          image.alt = produto.nome;

          const info = document.createElement("div");
          info.classList.add("product-info");

          const precoFormatado = `R$${parseFloat(produto.preco)
            .toFixed(2)
            .replace(".", ",")}`;
          const title = document.createElement("h2");
          title.textContent = `${produto.nome} - ${precoFormatado}`;

          const saborList = document.createElement("ul");
          const saboresUnicos = [...new Set(produto.sabores)];

          saboresUnicos.forEach((sabor) => {
            const li = document.createElement("li");
            li.textContent = sabor;
            saborList.appendChild(li);
          });

          info.appendChild(title);
          info.appendChild(saborList);
          card.appendChild(image);
          card.appendChild(info);
          container.appendChild(card);
        });
      },
    }
  );
});
