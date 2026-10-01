const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDarkMode = document.body.classList.contains("dark-theme");

  if (isDarkMode) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "light");
  }
});

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
  // Executa a renderização inicial se o array de produtos existir
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
