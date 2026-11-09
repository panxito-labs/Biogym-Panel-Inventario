/* Página: proveedores.html — catálogo de proveedores y productos bajo pedido */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "proveedores" || !Store.isLoggedIn()) return;

  /* ---- Tarjetas de proveedores ---- */
  const grid = document.getElementById("suppliersGrid");
  grid.innerHTML = Store.getSuppliers().map((s) => `
    <div class="col">
      <article class="card h-100 p-3 d-flex flex-column">
        <span class="action-icon">${icon("shop")}</span>
        <h2 class="h6 fw-bold mt-2 mb-1">${s.nombre}</h2>
        <span class="badge badge-soft-secondary align-self-start mb-2">${s.categoria}</span>
        <p class="text-secondary small flex-grow-1 mb-3">${s.contacto}</p>
        ${s.web
          ? `<a href="${s.web}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">Visitar sitio ${icon("external")}</a>`
          : `<button type="button" class="btn btn-outline-secondary btn-sm" disabled>Sitio por definir</button>`}
      </article>
    </div>`).join("");

  /* ---- Productos bajo pedido ---- */
  const tbody = document.getElementById("bajoPedidoBody");
  const products = Store.getBajoPedido();
  tbody.innerHTML = products.length
    ? products.map((p) => {
        const sup = Store.getSuppliers().find((s) => s.nombre === p.bajoPedido);
        const web = sup ? sup.web : "";
        return `
        <tr>
          <td class="sku-code">${p.sku}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="thumb">${productThumb(p)}</span>
              <strong>${p.nombre}</strong>
            </div>
          </td>
          <td>${p.categoria}</td>
          <td>${p.bajoPedido}</td>
          <td class="text-end">
            ${web
              ? `<a href="${web}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">Cotizar ${icon("external")}</a>`
              : `<span class="text-secondary small">Sitio por definir</span>`}
          </td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="5" class="text-center text-secondary py-3">No hay productos bajo pedido.</td></tr>`;
});
