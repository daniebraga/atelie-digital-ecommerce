const themeToggleBtn = document.getElementById("theme-toggle");
const logoImg = document.querySelector(".img-logo img");

function updateLogoTheme(isDark) {
  if (logoImg) {
    logoImg.src = isDark
      ? "assets/icons/logo-white.png"
      : "assets/icons/logo.png";
  }
}

// No clique do botão de tema:
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");

    updateLogoTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Ao carregar a página:
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  updateLogoTheme(true);
}

const productList = document.getElementById("products");
const categoryButtons = document.querySelectorAll(".nav .btn button");

function info(lista) {
  productList.innerHTML = "";
  if (lista.length === 0) {
    productList.innerHTML = "<p>Nenhum livro encontrado</p>";
    return;
  }

  lista.forEach((product) => {
    const card = ` 
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        
        <div class="product-footer">
          <span class="product-price">${product.price.toFixed(2).replace(".", ",")}</span>
          <button class="btn-add-cart" onclick="addToCart(${product.id})">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </article>
    `;

    productList.innerHTML += card;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof products !== "undefined") {
    info(products);
  } else {
    console.error(
      "Erro: O arquivo js/products.js não foi encontrado ou não declarou o array 'products'.",
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  lista(products);
});

function filtro(category) {
  if (category === "todos" || !category) {
    lista(products);
    return;
  }

  const filtroProducts = products.filter(
    (product) => product.category === category,
  );

  lista(filtroProducts);
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectCategory = button.dataset.category;

    filtro(selectCategory);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const searchInput = document.querySelector(".search-box input");
  const categoryButtons = document.querySelectorAll(".btn button");
  const productList =
    document.getElementById("products") ||
    document.querySelector(".products-grid");

  let currentCategory = "todos";
  let currentSearchQuery = "";

  window.info = function (lista) {
    if (!productList) return;

    productList.innerHTML = "";

    if (!lista || lista.length === 0) {
      productList.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p style="font-size: 1.1rem;">Nenhum e-book encontrado para essa busca. 🧶</p>
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

  function aplicarFiltros() {
    if (typeof products === "undefined") return;

    const filtered = products.filter((product) => {
      const matchesCategory =
        currentCategory === "todos" ||
        product.category.toLowerCase() === currentCategory.toLowerCase();

      const matchesSearch =
        product.title.toLowerCase().includes(currentSearchQuery) ||
        product.description.toLowerCase().includes(currentSearchQuery);

      return matchesCategory && matchesSearch;
    });

    info(filtered);
  }
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      aplicarFiltros();
    });
  }
  if (categoryButtons.length > 0) {
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        currentCategory = btn.getAttribute("data-category") || "todos";
        aplicarFiltros();
      });
    });
  }
  if (typeof products !== "undefined") {
    info(products);
  } else {
    console.error(
      "Erro: O array 'products' não foi carregado. Verifique a inclusão de js/products.js.",
    );
  }
});
