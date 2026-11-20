const form = document.querySelector("#product-form");
const tableBody = document.querySelector("#products-table-body");
const categorySelect = form.elements.categoryId;
const notice = document.querySelector("#admin-notice");
const formTitle = document.querySelector("#product-form-title");
const submitButton = form.querySelector("[type='submit']");
const idInput = form.elements.id;
const resetButton = document.querySelector("#reset-product-form");
const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

let products = [];
let categories = [];
let editingId = null;
let noticeTimer;

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.hidden = false;
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => {
    notice.hidden = true;
  }, 5000);
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

async function apiRequest(path, { method = "GET", json } = {}) {
  const headers = {};
  if (json !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(path, {
    method,
    headers,
    body: json === undefined ? undefined : JSON.stringify(json)
  });
  if (response.status === 401) {
    window.location.assign("/login.html");
    throw new Error("Tu sesión terminó. Inicia sesión para continuar.");
  }
  if (response.status === 403) {
    window.location.assign("/");
    throw new Error("Esta cuenta no tiene permisos de administración.");
  }
  if (response.status === 204) return null;

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "No se pudo completar la solicitud.");
  return result;
}

function populateCategories() {
  categorySelect.replaceChildren(...categories.map((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    return option;
  }));
}

function renderProducts() {
  document.querySelector("#product-count").textContent = `${products.length} productos`;
  if (products.length === 0) {
    tableBody.replaceChildren(createCell("No hay productos para mostrar.", "table-message"));
    tableBody.firstElementChild.colSpan = 6;
    return;
  }

  const rows = products.map((product) => {
    const row = document.createElement("tr");
    row.dataset.productId = product.id;
    const name = document.createElement("td");
    const nameText = document.createElement("span");
    nameText.className = "admin-product-name";
    nameText.textContent = `${product.emoji} ${product.name}`;
    name.append(nameText);

    row.append(
      name,
      createCell(categories.find((category) => category.id === product.category_id)?.name || product.category_id),
      createCell(money.format(product.price)),
      createCell(String(product.stock)),
      createCell(product.is_active ? "Activo" : "Archivado")
    );

    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "product-row-actions";
    if (product.is_active) {
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "product-row-action";
      editButton.dataset.action = "edit";
      editButton.dataset.productId = product.id;
      editButton.textContent = "Editar";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "product-row-action danger";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.productId = product.id;
      deleteButton.textContent = "Archivar";
      actionGroup.append(editButton, deleteButton);
    }
    actions.append(actionGroup);
    row.append(actions);
    return row;
  });
  tableBody.replaceChildren(...rows);
}

function resetForm() {
  form.reset();
  editingId = null;
  idInput.disabled = false;
  formTitle.textContent = "Agregar producto";
  submitButton.textContent = "Guardar producto";
  resetButton.hidden = true;
}

function editProduct(product) {
  editingId = product.id;
  form.elements.id.value = product.id;
  idInput.disabled = true;
  form.elements.categoryId.value = product.category_id;
  form.elements.name.value = product.name;
  form.elements.emoji.value = product.emoji;
  form.elements.description.value = product.description;
  form.elements.price.value = product.price;
  form.elements.stock.value = product.stock;
  form.elements.badge.value = product.badge;
  form.elements.rating.value = product.rating;
  form.elements.reviews.value = product.reviews;
  formTitle.textContent = `Editar: ${product.name}`;
  submitButton.textContent = "Guardar cambios";
  resetButton.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function readProductForm() {
  return {
    id: form.elements.id.value.trim(),
    categoryId: form.elements.categoryId.value,
    name: form.elements.name.value.trim(),
    emoji: form.elements.emoji.value.trim(),
    description: form.elements.description.value.trim(),
    price: Number(form.elements.price.value),
    stock: Number(form.elements.stock.value),
    badge: form.elements.badge.value.trim(),
    rating: Number(form.elements.rating.value),
    reviews: Number(form.elements.reviews.value)
  };
}

async function loadAdminData() {
  const { user } = await apiRequest("/api/auth/me");
  if (user.role !== "admin") {
    window.location.assign("/");
    return;
  }
  const [catalog, inventory] = await Promise.all([
    apiRequest("/api/catalog"),
    apiRequest("/api/admin/products")
  ]);
  categories = catalog.categories;
  products = inventory.products;
  populateCategories();
  renderProducts();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  try {
    const product = readProductForm();
    const result = await apiRequest(
      editingId ? `/api/admin/products/${encodeURIComponent(editingId)}` : "/api/admin/products",
      { method: editingId ? "PUT" : "POST", json: product }
    );
    showNotice(editingId ? "Producto actualizado." : "Producto agregado.");
    resetForm();
    await loadAdminData();
    if (result?.product) {
      const row = tableBody.querySelector(`[data-product-id="${CSS.escape(result.product.id)}"]`);
      row?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } catch (error) {
    showNotice(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

tableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const product = products.find((entry) => entry.id === button.dataset.productId);
  if (!product) return;

  if (button.dataset.action === "edit") {
    editProduct(product);
    return;
  }
  if (!window.confirm(`¿Archivar "${product.name}"? Se conservará en pedidos anteriores.`)) return;

  button.disabled = true;
  try {
    await apiRequest(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
    if (editingId === product.id) resetForm();
    showNotice("Producto archivado; los pedidos anteriores se conservan.");
    await loadAdminData();
  } catch (error) {
    showNotice(error.message, true);
  } finally {
    button.disabled = false;
  }
});

resetButton.addEventListener("click", resetForm);

document.querySelector("#admin-logout").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
    window.location.assign("/login.html");
  } catch (error) {
    showNotice(error.message, true);
    button.disabled = false;
  }
});

loadAdminData().catch((error) => {
  console.error("[Voltio] No se pudo cargar el panel de administración.", error);
  showNotice(error.message, true);
  tableBody.replaceChildren(createCell(error.message, "table-message"));
  tableBody.firstElementChild.colSpan = 6;
});
