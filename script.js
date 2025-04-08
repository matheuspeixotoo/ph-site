const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQKZXxrZJ45cmYrlNW2c06fxTZ9v8wKEJjNvj06zfP1g4Z3i9kbZ5raOw8aDWqo5jyChd7pg9tAEw3/pub?gid=0&single=true&output=csv";

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function (results) {
    const data = results.data;
    const container = document.getElementById("product-container");

    data.forEach((item) => {
      if (item.Sabor && item.Quantidade) {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <h2>${item.Sabor}</h2>
          <p>Quantidade: ${item.Quantidade}</p>
        `;

        container.appendChild(card);
      }
    });
  },
});
