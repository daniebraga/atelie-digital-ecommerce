document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("btn-tema");
  const body = document.body;

  const temaSalvo = localStorage.getItem("tema-atelie");
  if (temaSalvo === "dark") {
    body.classList.add("dark-theme");
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      if (body.classList.contains("dark-theme")) {
        localStorage.setItem("tema-atelie", "dark");
      } else {
        localStorage.setItem("tema-atelie", "light");
      }
    });
  }

  const gridProdutos = document.getElementById("grid-produtos");

  function renderizarProdutos(modo = "destaque", categoriaFiltro = "") {
    if (!gridProdutos) return;

    if (typeof products === "undefined") {
      console.error("O arquivo products.js não foi carregado corretamente!");
      return;
    }

    gridProdutos.innerHTML = "";

    let produtosParaExibir = [];

    if (modo === "destaque") {
      // Pega apenas os 3 primeiros produtos do seu products.js para a home/logo
      produtosParaExibir = products.slice(0, 3);
    } else if (modo === "categoria") {
      // Filtra todos os produtos correspondentes à categoria clicada no menu
      produtosParaExibir = products.filter(
        (p) => p.category === categoriaFiltro,
      );
    }

    if (produtosParaExibir.length === 0) {
      gridProdutos.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Nenhum e-book encontrado.</p>`;
      return;
    }

    produtosParaExibir.forEach((produto) => {
      const precoFormatado = produto.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const cardHTML = `
        <article class="card-produto">
          <img src="${produto.image}" alt="${produto.title}" />
          <div class="info-produto">
            <span class="tag">${produto.category.toUpperCase()}</span>
            <h3>${produto.title}</h3>
            <p class="preco">${precoFormatado}</p>
            <button class="btn-comprar">Comprar</button>
          </div>
        </article>
      `;

      gridProdutos.innerHTML += cardHTML;
    });
  }

  renderizarProdutos("destaque");

  const logoLink = document.querySelector(".logo");
  if (logoLink) {
    logoLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderizarProdutos("destaque");

      // Rola para o topo suavemente
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const linksNavbar = document.querySelectorAll('.menu a[href^="#"]');

  linksNavbar.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const destinoId = this.getAttribute("href"); // Ex: "#croche"
      const categoria = destinoId.replace("#", ""); // "croche"

      if (["croche", "bordado", "ceramica", "papelaria"].includes(categoria)) {
        // Mostra todos os produtos daquela categoria específica
        renderizarProdutos("categoria", categoria);
      }

      const elementoDestino = document.querySelector("#vitrine");
      if (elementoDestino) {
        elementoDestino.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
