const CART_STORAGE_KEY = "cart-atelie";
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  updateCartBadge();

  // Inicializa o modal se estiver na página principal (index.html)
  setupCartModalEvents();
  renderCartItems();

  // Inicializa a página de checkout se estiver nela (checkout.html)
  setupCheckoutPage();
});

function loadCartFromStorage() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (error) {
      console.error("Erro ao carregar o carrinho do localStorage:", error);
      cart = [];
    }
  } else {
    cart = [];
  }
}

function saveCartToStorage() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

window.addToCart = function (productId) {
  if (typeof products === "undefined") {
    console.error("products.js não foi carregado!");
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex((item) => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }

  saveCartToStorage();
  updateCartBadge();
  renderCartItems();
  openCartModal();
};

window.removeFromCart = function (productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
  updateCartBadge();
  renderCartItems();
  renderCheckoutSummary();
};

window.updateQuantity = function (productId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;

    if (cart[itemIndex].quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCartToStorage();
      updateCartBadge();
      renderCartItems();
      renderCheckoutSummary();
    }
  }
};

window.clearCart = function () {
  cart = [];
  saveCartToStorage();
  updateCartBadge();
  renderCartItems();
  renderCheckoutSummary();
};

function updateCartBadge() {
  const cartIconLink = document.querySelector('a[href="#carrinho"]');
  if (!cartIconLink) return;

  let badge = cartIconLink.querySelector(".cart-badge");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-badge";
      cartIconLink.appendChild(badge);
    }
    badge.textContent = totalItems;
  } else if (badge) {
    badge.remove();
  }
}

function renderCartItems() {
  const cartListContainer = document.getElementById("cart-items-list");
  const cartTotalContainer = document.getElementById("cart-total-price");

  if (!cartListContainer) return;

  cartListContainer.innerHTML = "";

  if (cart.length === 0) {
    cartListContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Seu carrinho está vazio.</p>
      </div>
    `;
    if (cartTotalContainer) cartTotalContainer.textContent = "R$ 0,00";
    return;
  }

  let totalSum = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalSum += itemTotal;

    const formattedPrice = itemTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    cartListContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">${formattedPrice}</span>
          <div class="cart-item-controls">
            <button class="btn-qty" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="btn-qty" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  });

  if (cartTotalContainer) {
    cartTotalContainer.textContent = totalSum.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

window.processCheckout = function () {
  if (!cart || cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  window.location.href = "checkout.html";
};

function openCartModal() {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.classList.add("open");
    renderCartItems();
  }
}

function closeCartModal() {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) cartModal.classList.remove("open");
}

function setupCartModalEvents() {
  const cartIconLink = document.querySelector('a[href="#carrinho"]');
  const closeBtn = document.getElementById("close-cart-btn");
  const cartModal = document.getElementById("cart-modal");

  if (cartIconLink) {
    cartIconLink.addEventListener("click", (e) => {
      e.preventDefault();
      openCartModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartModal);
  }

  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeCartModal();
    });
  }
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-items-list");
  const totalPriceContainer = document.getElementById("checkout-total-price");

  if (!summaryContainer) return;

  if (cart.length === 0) {
    summaryContainer.innerHTML = `
      <p style="text-align: center; color: var(--text-secondary); padding: 1rem 0;">
        Nenhum e-book selecionado. 🧶
      </p>
    `;
    if (totalPriceContainer) totalPriceContainer.textContent = "R$ 0,00";
    return;
  }

  summaryContainer.innerHTML = "";
  let totalSum = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalSum += itemTotal;

    const formattedPrice = itemTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    summaryContainer.innerHTML += `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.title}" />
        <div class="summary-item-info">
          <h4>${item.title}</h4>
          <span>Qtd: ${item.quantity}x (${formattedPrice})</span>
        </div>
      </div>
    `;
  });

  if (totalPriceContainer) {
    totalPriceContainer.textContent = totalSum.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

function setupCheckoutPage() {
  renderCheckoutSummary();

  const radioOptions = document.querySelectorAll(
    'input[name="forma-pagamento"]',
  );
  const painelPix = document.getElementById("painel-pix");
  const painelCartao = document.getElementById("painel-cartao");
  const optionLabels = document.querySelectorAll(".pagamento-option");

  if (radioOptions.length > 0) {
    radioOptions.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        optionLabels.forEach((label) => label.classList.remove("active"));
        e.target.closest(".pagamento-option").classList.add("active");

        if (e.target.value === "pix") {
          if (painelPix) painelPix.style.display = "block";
          if (painelCartao) painelCartao.style.display = "none";
        } else {
          if (painelPix) painelPix.style.display = "none";
          if (painelCartao) painelCartao.style.display = "block";
        }
      });
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }

      const nome = document.getElementById("nome")?.value || "Cliente";
      const email = document.getElementById("email")?.value || "";

      alert(
        `Obrigado pela compra, ${nome}! Os e-books foram enviados para o e-mail: ${email}`,
      );

      clearCart();
      window.location.href = "index.html";
    });
  }
}
