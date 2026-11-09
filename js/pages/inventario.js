/* Página: inventario.html — tabla con búsqueda y filtro por categoría */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "inventario" || !Store.isLoggedIn()) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const head = document.getElementById("inventoryHead");
  const body = document.getElementById("inventoryBody");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");

  Store.getCategories().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });

  function render() {
    const warehouses = Store.getWarehouses();
    const q = searchInput.value.trim().toLowerCase();
    const cat = categoryFilter.value;

    const filtered = Store.getProducts().filter((p) => {
      const matchQ = !q || [p.sku, p.nombre, p.categoria].some((v) => v.toLowerCase().includes(q));
      const matchCat = !cat || p.categoria === cat;
      return matchQ && matchCat;
    });

    head.innerHTML = `<tr>
      <th>SKU</th>
      <th>Producto</th>
      <th>Categoría</th>
      ${warehouses.map((w) => `<th class="text-end">${w}</th>`).join("")}
      <th class="text-end">Total</th>
      <th class="text-end">Precio</th>
      <th>Estado</th>
    </tr>`;

    body.innerHTML = filtered.map((p) => `
      <tr>
        <td class="sku-code">${p.sku}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span class="thumb">${productThumb(p)}</span>
            <div class="d-flex flex-column">
              <strong>${p.nombre}</strong>
              <small class="text-secondary">${p.descripcion || ""}</small>
            </div>
          </div>
        </td>
        <td>${p.categoria}</td>
        ${warehouses.map((w) => `<td class="text-end">${Store.isBajoPedido(p) ? "—" : (p.stock[w] || 0)}</td>`).join("")}
        <td class="text-end fw-bold">${Store.isBajoPedido(p) ? "—" : Store.totalStock(p)}</td>
        <td class="text-end">${fmtCLP(p.precio)}</td>
        <td>${statusBadge(p)}</td>
      </tr>`).join("");

    empty.classList.toggle("d-none", filtered.length > 0);
    count.textContent = `${filtered.length} producto${filtered.length === 1 ? "" : "s"} en la lista`;
  }

  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  render();
});
