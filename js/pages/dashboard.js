/* Página: dashboard.html — KPIs, alertas por bodega y movimientos recientes */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "dashboard" || !Store.isLoggedIn()) return;

  const products = Store.getProducts();
  const warehouses = Store.getWarehouses();
  const stocked = products.filter((p) => !Store.isBajoPedido(p));

  /* ---- Alertas por ubicación (agotado / stock bajo) ---- */
  const alerts = [];
  stocked.forEach((p) => {
    warehouses.forEach((w) => {
      const qty = p.stock[w] || 0;
      if (qty === 0) {
        alerts.push({ level: "red", nombre: p.nombre, txt: `Agotado en ${w}` });
      } else if (qty <= Store.LOW_STOCK) {
        alerts.push({ level: "yellow", nombre: p.nombre, txt: `Solo ${qty} unidades en ${w}` });
      }
    });
  });
  alerts.sort((a, b) => (a.level === "red" ? 0 : 1) - (b.level === "red" ? 0 : 1));

  /* ---- KPIs ---- */
  const totalUnidades = stocked.reduce((acc, p) => acc + Store.totalStock(p), 0);
  document.getElementById("kpiProductos").textContent = products.length;
  document.getElementById("kpiUnidades").textContent = totalUnidades;
  document.getElementById("kpiAlertas").textContent = alerts.length;
  document.getElementById("kpiBodegas").textContent = warehouses.length;

  /* ---- Accesos rápidos (iconos SVG, sin emojis) ---- */
  const quick = [
    { href: "inventario.html", ic: "clipboard", t: "Inventario", s: "Consulta el stock por bodega" },
    { href: "ingreso-stock.html", ic: "package", t: "Ingresar Stock", s: "Registrar entradas y nuevos productos" },
    { href: "traslado.html", ic: "repeat", t: "Traslado", s: "Mover unidades entre bodegas" },
    { href: "proveedores.html", ic: "shop", t: "Proveedores", s: "Catálogos bajo pedido en Santiago" }
  ];
  document.getElementById("quickAccess").innerHTML = quick.map((q) => `
    <div class="col">
      <a href="${q.href}" class="card action-card p-3 h-100">
        <span class="action-icon">${icon(q.ic)}</span>
        <span class="action-title mt-2">${q.t}</span>
        <span class="action-sub">${q.s}</span>
      </a>
    </div>`).join("");

  /* ---- Lista de alertas ---- */
  const list = document.getElementById("alertsList");
  list.innerHTML = alerts.length
    ? alerts.map((a) => `
        <div class="alert-item d-flex align-items-center gap-3 p-2">
          <span class="status-dot ${a.level}"></span>
          <div class="d-flex flex-column">
            <small class="fw-bold">${a.nombre}</small>
            <small class="text-secondary">${a.txt}</small>
          </div>
        </div>`).join("")
    : `<p class="text-secondary small mb-0 d-flex align-items-center gap-2">${icon("checkcircle")}Sin alertas de stock. ¡Todo en orden!</p>`;

  /* ---- Movimientos recientes (últimos 5) ---- */
  const tbody = document.getElementById("recentMovements");
  const movs = Store.getMovements().slice(0, 5);
  tbody.innerHTML = movs.length
    ? movs.map((m) => `
        <tr>
          <td class="text-secondary">${fechaCorta(m.fecha)}</td>
          <td>${m.producto}</td>
          <td><span class="badge ${m.tipo === "traslado" ? "badge-soft-warning" : "badge-soft-success"}">${m.tipo === "traslado" ? "Traslado" : "Ingreso"}</span></td>
          <td class="text-secondary">${m.origen} -&gt; ${m.destino}</td>
          <td class="text-end fw-bold">${m.unidades}</td>
        </tr>`).join("")
    : `<tr><td colspan="5" class="text-center text-secondary py-3">Aún no hay movimientos registrados.</td></tr>`;
});
