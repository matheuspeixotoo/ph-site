// Pega o nome da marca diretamente do título da página
const titulo = document.querySelector(".page-title").textContent;
const marcaAtual = titulo.split(" - ")[1]?.trim()?.toUpperCase();

const container = document.getElementById("product-container");

Papa.parse(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9CRwzTFu5Eea3mMI3A8O4kqlZ-dQoT_3vbX6AVvOAn4e2MNreYRI-PhlE-y-1VQ/pub?gid=0&single=true&output=csv",
  {
    download: true,
    header: true,
    complete: function (results) {
      const produtos = results.data;

      const produtosFiltrados = produtos.filter(
        (produto) => produto.Marca?.toUpperCase() === marcaAtual
      );

      produtosFiltrados.forEach((produto) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        // Imagem do produto
        const imagem = document.createElement("img");
        imagem.src = `./Assets/${produto.Imagem}`;
        imagem.alt = produto.Modelo;

        // Informações do produto
        const info = document.createElement("div");
        info.classList.add("product-info");

        const titulo = document.createElement("h2");
        titulo.textContent = `${produto.Modelo} - R$ ${produto.Preço}`;

        const lista = document.createElement("ul");

        if (produto.Sabores && produto.Sabores.trim() !== "") {
          const saboresSeparados = produto.Sabores.split(",");
          saboresSeparados.forEach((sabor) => {
            const li = document.createElement("li");
            li.textContent = sabor.trim();
            lista.appendChild(li);
          });
        }

        info.appendChild(titulo);
        info.appendChild(lista);

        card.appendChild(imagem);
        card.appendChild(info);
        container.appendChild(card);
      });
    },
  }
);
