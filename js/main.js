document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".hero");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const logoImg = document.querySelector(".img-logo img");
  const searchInput =
    document.getElementById("search-input") ||
    document.querySelector(".search-box input");
  const searchBtn =
    document.getElementById("search-btn") ||
    document.querySelector(".search-box button");
  const categoryButtons = document.querySelectorAll(".btn button");
  const productList =
    document.getElementById("products") ||
    document.querySelector(".products-grid");

  let currentCategory = "inicio";
  let currentSearchQuery = "";

  function applyTheme(isDark) {
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

    if (isDark) {
      document.body.classList.add("dark-theme");
      if (themeIcon) themeIcon.className = "fa-solid fa-moon";
      if (logoImg) logoImg.src = "assets/icons/logo-white.png";
    } else {
      document.body.classList.remove("dark-theme");
      if (themeIcon) themeIcon.className = "fa-solid fa-sun";
      if (logoImg) logoImg.src = "assets/icons/logo.png";
    }
  }

  // Carrega tema salvo
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    applyTheme(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark-theme");
      applyTheme(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  window.info = function (lista) {
    if (!productList) return;

    productList.innerHTML = "";

    if (!lista || lista.length === 0) {
      productList.innerHTML = `
        <div class="empty-state">
          <p>Nenhum e-book encontrado para essa busca. 🧶</p>
        </div>
      `;
      return;
    }

    lista.forEach((product) => {
      const priceNumber = Number(product.price) || 0;
      const formattedPrice = `R$ ${priceNumber.toFixed(2).replace(".", ",")}`;

      const card = ` 
        <article class="product-card" data-id="${product.id}" data-category="${product.category}">
          <img src="${product.image}" alt="${product.title}" class="product-image">
          
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            
            <div class="product-footer">
              <span class="product-price">${formattedPrice}</span>
              <button class="btn-add-cart" onclick="addToCart(${product.id})">
                Adicionar
              </button>
            </div>
          </div>
        </article>
      `;

      productList.innerHTML += card;
    });
  };

  function aplicarFiltROS() {
    if (typeof products === "undefined") return;

    // Controle da visibilidade da Hero: exibe APENAS na aba "todos" sem busca ativa
    if (heroSection) {
      const isTodos = currentCategory === "inicio" || currentCategory === "all";
      const isSearchEmpty = currentSearchQuery === "";

      if (isTodos && isSearchEmpty) {
        heroSection.style.display = "block";
      } else {
        heroSection.style.display = "none";
      }
    }

    const filtered = products.filter((product) => {
      const matchesCategory =
        currentCategory === "inicio" ||
        currentCategory === "inicio" ||
        product.category.toLowerCase() === currentCategory.toLowerCase();

      const matchesSearch =
        product.title.toLowerCase().includes(currentSearchQuery) ||
        product.description.toLowerCase().includes(currentSearchQuery);

      return matchesCategory && matchesSearch;
    });

    info(filtered);
  }

  if (searchInput && searchBtn) {
    const searchIcon = searchBtn.querySelector("i");

    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();

      if (e.target.value.length > 0) {
        if (searchIcon) searchIcon.className = "fa-solid fa-xmark";
      } else {
        if (searchIcon) searchIcon.className = "fa-solid fa-magnifying-glass";
      }

      aplicarFiltROS();
    });

    searchBtn.addEventListener("click", () => {
      if (searchInput.value.length > 0) {
        searchInput.value = "";
        currentSearchQuery = "";
        if (searchIcon) searchIcon.className = "fa-solid fa-magnifying-glass";
        searchInput.focus();
        aplicarFiltROS();
      }
    });
  }

  if (categoryButtons.length > 0) {
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        currentCategory = btn.getAttribute("data-category") || "inicio";
        aplicarFiltROS();
      });
    });
  }

  if (typeof products !== "undefined") {
    info(products);
  } else {
    console.error(
      "Erro: O array 'products' não foi encontrado. Verifique se js/products.js está incluído antes de main.js.",
    );
  }
});
