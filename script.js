document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");

  Papa.parse(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG7xPPn-bd5_AUSvYfywduL3bquyp1PyshYGCjkIsNejft-8CmLeECG5Ih2s-zodDGctv9glmS19jd/pub?output=csv",
    {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;

        // Log pra verificar o que tá vindo
        console.log("Dados recebidos da planilha:", data);

        // Filtrar apenas ELFBAR
        const elfbarProducts = data.filter(
          (item) => item.Marca?.trim() === "ELFBAR"
        );

        elfbarProducts.forEach((item) => {
          const card = document.createElement("div");
          card.classList.add("product-card");

          // Corrigir nome da coluna se necessário
          const imagemNome = item.Imagem?.trim();
          const saboresTexto = item.Sabor?.trim();

          const image = document.createElement("img");
          image.src = `./Assets/${imagemNome}`;
          image.alt = item.Produto;

          const info = document.createElement("div");
          info.classList.add("product-info");

          // Formatar preço
          const precoFormatado = `R$${parseFloat(item.Preço)
            .toFixed(2)
            .replace(".", ",")}`;

          const title = document.createElement("h2");
          title.textContent = `${item.Produto} - ${precoFormatado}`;

          const saborList = document.createElement("ul");

          if (saboresTexto) {
            const sabores = saboresTexto.split(",").map((s) => s.trim());
            sabores.forEach((sabor) => {
              const li = document.createElement("li");
              li.textContent = sabor;
              saborList.appendChild(li);
            });
          }

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
