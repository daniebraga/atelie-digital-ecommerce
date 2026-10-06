document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. SELEÇÃO DE ELEMENTOS DO DOM
  // ==========================================================================
  const themeToggleButton = document.getElementById("btn-tema");
  const body = document.body;
  const gridProdutos = document.getElementById("grid-produtos");
  const heroSection = document.querySelector(".hero");
  const logoLink = document.querySelector(".logo");
  const linksNavbar = document.querySelectorAll(".menu ul a");
  const tituloSecao = document.querySelector(".titulo-secao");

  // Elementos de busca
  const searchInput =
    document.getElementById("search-input") ||
    document.querySelector(".search-box input");
  const searchBtn =
    document.getElementById("search-btn") ||
    document.querySelector(".search-box button");

  // Estado dos filtros ("destaque" é o padrão inicial)
  let currentCategory = "destaque";
  let currentSearchQuery = "";

  // ==========================================================================
  // 2. ALTERNÂNCIA E PERSISTÊNCIA DO DARK MODE
  // ==========================================================================
  const temaSalvo = localStorage.getItem("tema-atelie");
  if (temaSalvo === "dark") {
    body.classList.add("dark-theme");
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");
      localStorage.setItem("tema-atelie", isDark ? "dark" : "light");
    });
  }

  // Helper para destacar visualmente a categoria ativa no menu
  function atualizarLinkAtivo(categoriaAtiva) {
    linksNavbar.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "").toLowerCase();
      if (href === categoriaAtiva.toLowerCase()) {
        link.classList.add("ativo");
      } else {
        link.classList.remove("ativo");
      }
    });
  }

  // ==========================================================================
  // 3. RENDERIZAÇÃO DE PRODUTOS
  // ==========================================================================
  function renderizarProdutos() {
    if (!gridProdutos) return;

    if (typeof products === "undefined") {
      console.error("O arquivo products.js não foi carregado corretamente!");
      return;
    }

    gridProdutos.innerHTML = "";
    let produtosParaExibir = [];

    // SE HOUVER BUSCA POR TEXTO
    if (currentSearchQuery !== "") {
      if (heroSection) heroSection.style.display = "none";
      if (tituloSecao) tituloSecao.textContent = "Resultados da Pesquisa";

      produtosParaExibir = products.filter((p) => {
        const titulo = p.title ? p.title.toLowerCase() : "";
        const descricao = p.description ? p.description.toLowerCase() : "";
        const categoria = p.category ? p.category.toLowerCase() : "";

        const matchesSearch =
          titulo.includes(currentSearchQuery) ||
          descricao.includes(currentSearchQuery) ||
          categoria.includes(currentSearchQuery);

        const matchesCategory =
          currentCategory === "destaque" ||
          currentCategory === "todos" ||
          categoria === currentCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });
    }
    // SE ESTIVER EM UMA CATEGORIA ESPECÍFICA (Crochê, Bordado, Cerâmica, Papelaria)
    else if (currentCategory !== "destaque" && currentCategory !== "todos") {
      if (heroSection) heroSection.style.display = "none";

      // Atualiza o título da seção com o nome da categoria formatado
      if (tituloSecao) {
        tituloSecao.textContent =
          currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      }

      produtosParaExibir = products.filter(
        (p) => p.category.toLowerCase() === currentCategory.toLowerCase(),
      );
    }
    // MODO INICIAL / DESTAQUE (3 primeiros produtos + Hero)
    else {
      if (heroSection) heroSection.style.display = "block";
      if (tituloSecao) tituloSecao.textContent = "E-books em Destaque";

      produtosParaExibir = products.slice(0, 3);
    }

    // Mensagem se nenhum produto for encontrado
    if (produtosParaExibir.length === 0) {
      gridProdutos.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="color: var(--text-secondary); font-size: 1.1rem;">Nenhum e-book encontrado. 🧶</p>
        </div>
      `;
      return;
    }

    // Renderiza os cards
    produtosParaExibir.forEach((produto) => {
      const precoFormatado = Number(produto.price || 0).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        },
      );

      const cardHTML = `
        <article class="card-produto">
          <img src="${produto.image}" alt="${produto.title}" />
          <div class="info-produto">
            <span class="tag">${produto.category.toUpperCase()}</span>
            <h3>${produto.title}</h3>
            <p class="preco">${precoFormatado}</p>
            <button class="btn-comprar" onclick="addToCart(${produto.id})">Comprar</button>
          </div>
        </article>
      `;

      gridProdutos.innerHTML += cardHTML;
    });
  }

  // Inicializa a página mostrando os destaques
  renderizarProdutos();

  // ==========================================================================
  // 4. CLIQUE NA LOGO (VOLTA PARA A HOME COM DESTAQUES)
  // ==========================================================================
  if (logoLink) {
    logoLink.addEventListener("click", (event) => {
      event.preventDefault();
      currentCategory = "destaque";
      currentSearchQuery = "";
      if (searchInput) searchInput.value = "";
      atualizarLinkAtivo("");
      atualizarIconeBusca();
      renderizarProdutos();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // 5. CLIQUES NOS LINKS DAS CATEGORIAS DA NAVBAR
  // ==========================================================================
  linksNavbar.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const destinoId = this.getAttribute("href"); // Ex: "#croche"
      const categoria = destinoId.replace("#", "").toLowerCase();

      currentSearchQuery = "";
      if (searchInput) searchInput.value = "";
      atualizarIconeBusca();

      if (["croche", "bordado", "ceramica", "papelaria"].includes(categoria)) {
        currentCategory = categoria;
        atualizarLinkAtivo(categoria);
      } else {
        currentCategory = "destaque";
        atualizarLinkAtivo("");
      }

      renderizarProdutos();

      const elementoDestino =
        document.querySelector("#vitrine") || gridProdutos;
      if (elementoDestino) {
        elementoDestino.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ==========================================================================
  // 6. LÓGICA DA BUSCA E BOTÃO LUPA / "X"
  // ==========================================================================
  function atualizarIconeBusca() {
    if (!searchBtn) return;
    const searchIcon = searchBtn.querySelector("i");
    if (!searchIcon) return;

    if (searchInput && searchInput.value.trim().length > 0) {
      searchIcon.className = "fa-solid fa-xmark";
    } else {
      searchIcon.className = "fa-solid fa-magnifying-glass";
    }
  }

  if (searchInput && searchBtn) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      atualizarIconeBusca();
      renderizarProdutos();
    });

    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        currentSearchQuery = searchInput.value.toLowerCase().trim();
        atualizarIconeBusca();
        renderizarProdutos();
      }
    });

    searchBtn.addEventListener("click", () => {
      if (searchInput.value.length > 0) {
        searchInput.value = "";
        currentSearchQuery = "";
        atualizarIconeBusca();
        searchInput.focus();
        renderizarProdutos();
      } else {
        searchInput.focus();
      }
    });
  }
});

gridProdutos.addEventListener("click", (event) => {
  if (event.target.classList.contains(btn - add - cart)) {
    const productId = Number(event.target.dataset.id);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof products !== "undefined") {
    renderProducts(products);
  }
});
