fetch("/api/catalog")
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo cargar el catálogo.");
        return response.json();
      })
      .then(({ categories }) => initializeStore(categories))
      .catch((error) => {
        console.error("[Voltio] No se pudo cargar el catálogo.", error);
        document.querySelector("#product-sections").textContent =
          "No se pudo cargar el catálogo. Actualiza la página para volver a intentar.";
      });

    function initializeStore(categories) {
    const requestedCategoryId = new URLSearchParams(window.location.search).get("categoria");
    const activeCategory = categories.find((category) => category.id === requestedCategoryId);

    const money = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0
    });

    const productSections = document.querySelector("#product-sections");
    const searchInput = document.querySelector("#product-search");
    const noResults = document.querySelector("#no-results");
    const categoryTrigger = document.querySelector("#category-trigger");
    const categoryDropdown = document.querySelector("#category-dropdown");
    const cartButton = document.querySelector("#cart-button");
    const cartPanel = document.querySelector("#cart-panel");
    const cartCount = document.querySelector("#cart-count");
    const cartItems = document.querySelector("#cart-items");
    const cartTotal = document.querySelector("#cart-total");
    const toast = document.querySelector("#toast");
    const specDialog = document.querySelector("#spec-dialog");
    const specTitle = document.querySelector("#spec-title");
    const specDescription = document.querySelector("#spec-description");
    const specList = document.querySelector("#spec-list");
    const checkoutDialog = document.querySelector("#checkout-dialog");
    const checkoutForm = document.querySelector("#checkout-form");
    const checkoutMessage = document.querySelector("#checkout-message");
    const checkoutSuccess = document.querySelector("#checkout-success");
    const checkoutSuccessMessage = document.querySelector("#checkout-success-message");
    const ordersDialog = document.querySelector("#orders-dialog");
    const ordersList = document.querySelector("#orders-list");
    const pageSize = 5;
    const cartStorageKey = "voltio.cart.v1";
    const cart = loadCart();
    const categoryPages = new Map();
    let toastTimer;

    function createElement(tagName, className, text) {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    }

    function createProductCard(category, product) {
      const card = createElement("article", "product-card");
      card.dataset.productId = product.id;
      card.dataset.search = `${category.name} ${product.name} ${product.description}`.toLocaleLowerCase("es-MX");

      const artwork = createElement("div", "product-art");
      if (product.badge) artwork.append(createElement("span", "badge", product.badge));
      artwork.append(createElement("span", "product-emoji", product.emoji));
      artwork.lastElementChild.setAttribute("aria-hidden", "true");

      const info = createElement("div", "product-info");
      info.append(createElement("p", "product-category", category.name));
      info.append(createElement("h4", "", product.name));
      info.append(createElement("p", "product-description", product.description));
      info.append(createElement(
        "p",
        "product-stock",
        product.stock > 0 ? `${product.stock} unidades de muestra disponibles` : "Agotado"
      ));

      const rating = createElement("p", "rating");
      rating.setAttribute("aria-label", `Calificación ${product.rating} de 5`);
      rating.append(document.createTextNode("★★★★★ "));
      rating.append(createElement("span", "", `${product.rating} (${product.reviews})`));
      info.append(rating);

      const tools = createElement("div", "product-tools");
      const productBottom = createElement("div", "product-bottom");
      productBottom.append(createElement("span", "price", money.format(product.price)));

      const addButton = createElement("button", "add-button", product.stock > 0 ? "+" : "×");
      addButton.type = "button";
      addButton.dataset.productId = product.id;
      addButton.disabled = product.stock <= 0;
      addButton.setAttribute(
        "aria-label",
        product.stock > 0 ? `Agregar ${product.name} al carrito` : `${product.name} agotado`
      );
      addButton.title = "Agregar al carrito";
      productBottom.append(addButton);

      const specificationsButton = createElement("button", "spec-button", "Ver especificaciones");
      specificationsButton.type = "button";
      specificationsButton.dataset.specId = product.id;

      tools.append(productBottom, specificationsButton);
      info.append(tools);
      card.append(artwork, info);
      return card;
    }

    function renderProducts() {
      const sections = categories.map((category) => {
        const section = createElement("section", "category-section");
        section.id = category.id;
        section.setAttribute("aria-labelledby", `title-${category.id}`);

        const title = createElement("h3", "category-title");
        title.id = `title-${category.id}`;
        const emoji = createElement("span", "emoji", category.emoji);
        emoji.setAttribute("aria-hidden", "true");
        title.append(emoji, document.createTextNode(category.name));

        const count = createElement("small");
        const countLink = createElement("a", "category-count-link", `${category.products.length} productos`);
        countLink.href = `?categoria=${encodeURIComponent(category.id)}`;
        count.append(countLink);
        title.append(count);

        const grid = createElement("div", "product-grid");
        category.products.forEach((product) => grid.append(createProductCard(category, product)));

        const pagination = createElement("nav", "pagination");
        pagination.dataset.paginationFor = category.id;
        pagination.setAttribute("aria-label", `Paginación de ${category.name}`);

        const status = createElement("p", "pagination-status");
        status.dataset.statusFor = category.id;

        section.append(title, grid, pagination, status);
        return section;
      });

      productSections.replaceChildren(...sections);
    }

    function createPageButton(label, categoryId, attributes = {}) {
      const button = createElement("button", "", label);
      button.type = "button";
      button.dataset.categoryId = categoryId;
      Object.entries(attributes).forEach(([name, value]) => {
        if (name === "disabled") button.disabled = value;
        else if (name === "ariaCurrent") {
          if (value) button.setAttribute("aria-current", value);
        }
        else button.dataset[name] = value;
      });
      return button;
    }

    function loadCart() {
      try {
        const savedCart = window.localStorage.getItem(cartStorageKey);
        if (!savedCart) return new Map();

        const entries = JSON.parse(savedCart);
        const products = new Map(
          categories.flatMap((category) => category.products.map((product) => [product.id, product]))
        );
        if (!Array.isArray(entries)) throw new TypeError("El contenido guardado del carrito no es válido.");

        const validEntries = entries
          .filter((entry) => Array.isArray(entry) && entry.length === 2)
          .filter(([productId, quantity]) =>
            products.has(productId) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99
          )
          .map(([productId, quantity]) => [
            productId,
            Math.min(quantity, products.get(productId).stock)
          ])
          .filter(([, quantity]) => quantity > 0);
        return new Map(validEntries);
      } catch (error) {
        console.error("[Voltio] No se pudo recuperar el carrito guardado.", error);
        return new Map();
      }
    }

    function saveCart() {
      try {
        window.localStorage.setItem(cartStorageKey, JSON.stringify([...cart.entries()]));
      } catch (error) {
        console.error("[Voltio] No se pudo guardar el carrito.", error);
        showToast("No se pudo guardar el carrito en este navegador.");
      }
    }

    function updateCatalog(query = searchInput.value.trim().toLocaleLowerCase("es-MX")) {
      let totalMatches = 0;

      for (const category of categories) {
        const section = document.querySelector(`#${category.id}`);
        if (activeCategory && category.id !== activeCategory.id) {
          section.hidden = true;
          continue;
        }
        const matchingProducts = category.products.filter((product) =>
          `${category.name} ${product.name} ${product.description}`.toLocaleLowerCase("es-MX").includes(query)
        );
        totalMatches += matchingProducts.length;
        section.hidden = matchingProducts.length === 0;
        const productLabel = matchingProducts.length === 1 ? "producto" : "productos";
        section.querySelector(".category-count-link").textContent = `${matchingProducts.length} ${productLabel}`;

        const pageCount = Math.ceil(matchingProducts.length / pageSize);
        const page = Math.min(categoryPages.get(category.id) || 1, Math.max(pageCount, 1));
        categoryPages.set(category.id, page);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const visibleProductIds = new Set(matchingProducts.slice(startIndex, endIndex).map((product) => product.id));

        section.querySelectorAll(".product-card").forEach((card) => {
          card.hidden = !visibleProductIds.has(card.dataset.productId);
        });

        const pagination = section.querySelector(".pagination");
        const status = section.querySelector(".pagination-status");
        pagination.hidden = pageCount <= 1;
        const pageButtons = Array.from({ length: pageCount }, (_, index) => {
          const pageNumber = index + 1;
          const button = createPageButton(String(pageNumber), category.id, {
            page: String(pageNumber),
            ariaCurrent: pageNumber === page ? "page" : ""
          });
          button.setAttribute("aria-label", `Página ${pageNumber}`);
          return button;
        });
        const pageList = createElement("span", "pagination-pages");
        pageList.append(...pageButtons);
        pagination.replaceChildren(
          createPageButton("← Atrás", category.id, { pageAction: "previous", disabled: page === 1 }),
          pageList,
          createPageButton("Siguiente →", category.id, { pageAction: "next", disabled: page === pageCount })
        );

        const firstItem = matchingProducts.length === 0 ? 0 : startIndex + 1;
        const lastItem = Math.min(endIndex, matchingProducts.length);
        status.textContent = matchingProducts.length
          ? `Mostrando ${firstItem}–${lastItem} de ${matchingProducts.length} productos`
          : "";
      }

      noResults.classList.toggle("is-visible", totalMatches === 0);
    }

    function showToast(text) {
      toast.textContent = text;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
    }

    function renderOrders(orders) {
      if (orders.length === 0) {
        ordersList.replaceChildren(createElement("p", "orders-empty", "Todavía no tienes pedidos."));
        return;
      }

      const orderCards = orders.map((order) => {
        const card = createElement("article", "order-card");
        const heading = createElement("div", "order-card-heading");
        heading.append(
          createElement("strong", "", `Pedido #${order.id}`),
          createElement("span", "order-status", "Pendiente")
        );
        card.append(heading);
        card.append(createElement(
          "p",
          "order-date",
          new Date(order.createdAt).toLocaleString("es-MX")
        ));

        const items = createElement("ul", "order-items");
        for (const item of order.items) {
          items.append(createElement(
            "li",
            "",
            `${item.quantity} × ${item.productName} · ${money.format(item.unitPrice)}`
          ));
        }
        card.append(items);
        card.append(createElement("p", "order-total", `Total: ${money.format(order.total)}`));
        return card;
      });
      ordersList.replaceChildren(...orderCards);
    }

    function showOrders() {
      ordersList.textContent = "Cargando tus pedidos...";
      ordersDialog.showModal();
      fetch("/api/orders")
        .then(async (response) => {
          if (response.status === 401) {
            window.location.assign("/login.html");
            throw new Error("La sesión expiró.");
          }
          if (!response.ok) throw new Error("No se pudieron cargar tus pedidos.");
          return response.json();
        })
        .then(({ orders }) => renderOrders(orders))
        .catch((error) => {
          console.error("[Voltio] No se pudieron cargar los pedidos.", error);
          ordersList.textContent = "No se pudieron cargar los pedidos. Inténtalo de nuevo.";
        });
    }

    function findProduct(productId) {
      for (const category of categories) {
        const product = category.products.find((item) => item.id === productId);
        if (product) return { ...product, category: category.name };
      }
      return null;
    }

    function showSpecifications(productId) {
      const category = categories.find((item) => item.products.some((product) => product.id === productId));
      const product = category?.products.find((item) => item.id === productId);
      if (!category || !product) return;

      specTitle.textContent = product.name;
      specDescription.textContent = product.description;
      const specifications = [
        ["Categoría", category.name],
        ["Precio", money.format(product.price)],
        ...category.specifications
      ];
      const rows = specifications.flatMap(([label, value]) => [
        createElement("dt", "", label),
        createElement("dd", "", value)
      ]);
      specList.replaceChildren(...rows);
      specDialog.showModal();
    }

    function addToCart(productId, amount = 1) {
      const product = findProduct(productId);
      if (!product) return;
      const current = cart.get(productId) || 0;
      const next = current + amount;
      if (amount > 0 && next > Math.min(99, product.stock)) {
        showToast(product.stock === 0 ? "Este producto está agotado." : "No hay suficientes existencias de muestra.");
        return;
      }
      if (next <= 0) {
        cart.delete(productId);
      } else {
        cart.set(productId, next);
      }
      saveCart();
      renderCart();
    }

    function renderCart() {
      const totalItems = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
      let totalPrice = 0;
      cartCount.textContent = String(totalItems);
      cartButton.setAttribute("aria-label", `Carrito, ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`);

      if (cart.size === 0) {
        cartItems.replaceChildren(createElement("p", "cart-empty", "Tu carrito está vacío. ¡Explora la tienda!"));
      } else {
        const itemElements = [...cart.entries()].map(([id, quantity]) => {
          const product = findProduct(id);
          if (!product) return null;
          totalPrice += product.price * quantity;
          const item = createElement("div", "cart-item");
          const emoji = createElement("span", "cart-item-emoji", product.emoji);
          emoji.setAttribute("aria-hidden", "true");

          const details = createElement("div", "cart-item-details");
          details.append(
            createElement("strong", "", product.name),
            createElement("span", "", `${money.format(product.price)} c/u`)
          );

          const quantityControl = createElement("div", "quantity-control");
          quantityControl.setAttribute("aria-label", `Cantidad de ${product.name}`);
          const decreaseButton = createCartButton("decrease", id, "−", "Quitar una unidad");
          const increaseButton = createCartButton("increase", id, "+", "Agregar una unidad");
          increaseButton.disabled = quantity >= Math.min(99, product.stock);
          quantityControl.append(decreaseButton, createElement("span", "", String(quantity)), increaseButton);
          item.append(emoji, details, quantityControl);
          return item;
        }).filter(Boolean);
        cartItems.replaceChildren(...itemElements);
      }

      cartTotal.textContent = money.format(totalPrice);
    }

    function createCartButton(action, productId, label, accessibleName) {
      const button = createElement("button", "", label);
      button.type = "button";
      button.dataset.cartAction = action;
      button.dataset.productId = productId;
      button.setAttribute("aria-label", accessibleName);
      return button;
    }

    function setCategoryMenu(open) {
      categoryTrigger.setAttribute("aria-expanded", String(open));
      categoryDropdown.classList.toggle("is-open", open);
    }

    function setCartOpen(open) {
      cartButton.setAttribute("aria-expanded", String(open));
      cartPanel.classList.toggle("is-open", open);
      cartPanel.setAttribute("aria-hidden", String(!open));
      if (open) document.querySelector("#close-cart").focus();
    }

    function configureCategoryPage() {
      if (!activeCategory) return;

      document.body.classList.add("category-page");
      document.querySelector(".hero").hidden = true;
      document.querySelector(".benefits").hidden = true;
      document.querySelector("#category-back").hidden = false;
      document.querySelector(".section-heading .kicker").textContent = "Explora la categoría";
      const catalogTitle = document.querySelector("#catalog-title");
      const pageTitle = createElement("h1", "", activeCategory.name);
      pageTitle.id = catalogTitle.id;
      catalogTitle.replaceWith(pageTitle);
      document.querySelector(".section-heading > p").textContent =
        `Descubre los ${activeCategory.products.length} productos de ${activeCategory.name} y revisa sus especificaciones.`;
      document.title = `${activeCategory.name} | Voltio`;
    }

    renderProducts();
    renderCart();
    configureCategoryPage();
    updateCatalog();

    fetch("/api/auth/me")
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) throw new Error("No se pudo validar la sesión.");
        const { user } = await response.json();
        return user;
      })
      .then((user) => {
        if (user?.role === "admin") document.querySelector("#admin-link").hidden = false;
      })
      .catch((error) => console.error("[Voltio] No se pudo validar la sesión.", error));

    categoryTrigger.addEventListener("click", () => {
      setCategoryMenu(categoryTrigger.getAttribute("aria-expanded") !== "true");
    });

    categoryDropdown.addEventListener("click", (event) => {
      if (event.target.closest("a")) setCategoryMenu(false);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".category-menu")) setCategoryMenu(false);
      if (!event.target.closest("#cart-panel, #cart-button")) setCartOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (specDialog.open) {
          event.preventDefault();
          specDialog.close();
          return;
        }
        const categoryMenuWasOpen = categoryTrigger.getAttribute("aria-expanded") === "true";
        const cartWasOpen = cartButton.getAttribute("aria-expanded") === "true";
        setCategoryMenu(false);
        setCartOpen(false);
        if (cartWasOpen) cartButton.focus();
        else if (categoryMenuWasOpen) categoryTrigger.focus();
      }
    });

    productSections.addEventListener("click", (event) => {
      const pageControl = event.target.closest("[data-page-action], [data-page]");
      if (pageControl) {
        const categoryId = pageControl.dataset.categoryId;
        const currentPage = categoryPages.get(categoryId) || 1;
        const nextPage = pageControl.dataset.page
          ? Number(pageControl.dataset.page)
          : currentPage + (pageControl.dataset.pageAction === "next" ? 1 : -1);
        categoryPages.set(categoryId, Math.max(1, nextPage));
        updateCatalog();
        return;
      }

      const specButton = event.target.closest("[data-spec-id]");
      if (specButton) {
        showSpecifications(specButton.dataset.specId);
        return;
      }

      const addButton = event.target.closest(".add-button");
      if (!addButton) return;
      const product = findProduct(addButton.dataset.productId);
      if (!product) return;
      addToCart(product.id);
      showToast(`${product.name} se agregó al carrito.`);
    });

    cartItems.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;
      const change = button.dataset.cartAction === "increase" ? 1 : -1;
      addToCart(button.dataset.productId, change);
    });

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLocaleLowerCase("es-MX");
      for (const category of categories) categoryPages.set(category.id, 1);
      updateCatalog(query);
    });

    cartButton.addEventListener("click", () => {
      setCartOpen(cartButton.getAttribute("aria-expanded") !== "true");
    });

    document.querySelector("#close-cart").addEventListener("click", () => {
      setCartOpen(false);
      cartButton.focus();
    });

    document.querySelector("#close-specs").addEventListener("click", () => specDialog.close());

    document.querySelector("#checkout-button").addEventListener("click", () => {
      if (cart.size === 0) {
        showToast("Agrega algún producto antes de continuar.");
        return;
      }
      checkoutForm.reset();
      checkoutForm.hidden = false;
      checkoutSuccess.hidden = true;
      checkoutMessage.hidden = true;
      setCartOpen(false);
      checkoutDialog.showModal();
    });

    checkoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!checkoutForm.reportValidity()) return;

      const submitButton = checkoutForm.querySelector("[type='submit']");
      submitButton.disabled = true;
      checkoutMessage.hidden = true;
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: checkoutForm.elements.name.value,
            phone: checkoutForm.elements.phone.value,
            address: checkoutForm.elements.address.value,
            items: [...cart].map(([productId, quantity]) => ({ productId, quantity }))
          })
        });
        const result = await response.json();

        if (response.status === 401) {
          window.location.assign("/login.html");
          return;
        }
        if (!response.ok) {
          checkoutMessage.textContent = result.error || "No se pudo crear el pedido.";
          checkoutMessage.hidden = false;
          return;
        }

        for (const item of result.order.items) {
          const product = categories
            .flatMap((category) => category.products)
            .find((entry) => entry.id === item.productId);
          if (product) product.stock = item.stock;
        }
        cart.clear();
        saveCart();
        renderProducts();
        renderCart();
        updateCatalog();
        checkoutForm.hidden = true;
        checkoutSuccessMessage.textContent =
          `Pedido #${result.order.id} creado y pendiente. Total: ${money.format(result.order.total)}. No se realizó ningún pago.`;
        checkoutSuccess.hidden = false;
      } catch (error) {
        console.error("[Voltio] No se pudo crear el pedido.", error);
        checkoutMessage.textContent = "No se pudo conectar con el servidor. Inténtalo de nuevo.";
        checkoutMessage.hidden = false;
      } finally {
        submitButton.disabled = false;
      }
    });

    document.querySelector("#orders-button").addEventListener("click", showOrders);
    document.querySelector("#success-view-orders").addEventListener("click", () => {
      checkoutDialog.close();
      showOrders();
    });
    document.querySelector("#close-checkout").addEventListener("click", () => checkoutDialog.close());
    document.querySelector("#close-orders").addEventListener("click", () => ordersDialog.close());
    }
