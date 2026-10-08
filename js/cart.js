const CART_STORAGE_KEY = "cart-atelie";
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  updateCartBadge();
  setupCartModalEvents();
  renderCartItems();
  setupCheckoutPage();
});

function loadCartFromStorage() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (error) {
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
  if (typeof products === "undefined") return;

  const idNumerico = Number(productId);
  const product = products.find((p) => Number(p.id) === idNumerico);

  if (!product) return;

  const existingIndex = cart.findIndex(
    (item) => Number(item.id) === idNumerico,
  );

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
  window.openCartModal();
};

window.removeFromCart = function (productId) {
  const idNumerico = Number(productId);
  cart = cart.filter((item) => Number(item.id) !== idNumerico);
  saveCartToStorage();
  updateCartBadge();
  renderCartItems();
  renderCheckoutSummary();
};

window.updateQuantity = function (productId, delta) {
  const idNumerico = Number(productId);
  const itemIndex = cart.findIndex((item) => Number(item.id) === idNumerico);

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
  const cartIconLinks = document.querySelectorAll(
    'a[href="#carrinho"], .btn-icone[aria-label="Ver Carrinho"]',
  );
  const totalItems = cart.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0,
  );

  cartIconLinks.forEach((link) => {
    let badge = link.querySelector(".cart-badge");
    if (totalItems > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        link.appendChild(badge);
      }
      badge.textContent = totalItems;
    } else if (badge) {
      badge.remove();
    }
  });
}

function renderCartItems() {
  const cartListContainer = document.getElementById("cart-items-list");
  const cartTotalContainer = document.getElementById("cart-total-price");

  if (!cartListContainer) return;

  cartListContainer.innerHTML = "";
  cart = cart.filter((item) => item && item.id && item.price);

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
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    const itemTotal = price * qty;
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
            <span class="cart-item-qty">${qty}</span>
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

window.openCartModal = function () {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.classList.add("open");
    cartModal.setAttribute("aria-hidden", "false");
    renderCartItems();
  }
};

window.closeCartModal = function () {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.classList.remove("open");
    cartModal.setAttribute("aria-hidden", "true");
  }
};

function setupCartModalEvents() {
  const cartButtons = document.querySelectorAll(
    'a[href="#carrinho"], .btn-icone[aria-label="Ver Carrinho"]',
  );
  const closeBtn = document.getElementById("close-cart-btn");
  const cartModal = document.getElementById("cart-modal");

  cartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.openCartModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", window.closeCartModal);
  }

  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) window.closeCartModal();
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
    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
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
