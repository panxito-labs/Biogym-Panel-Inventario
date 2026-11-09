/* Página: traslado.html — traslado entre bodegas, gestión de bodegas e historial */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "traslado" || !Store.isLoggedIn()) return;

  const form = document.getElementById("transferForm");
  const prodSel = document.getElementById("transferProduct");
  const fromSel = document.getElementById("transferFrom");
  const toSel = document.getElementById("transferTo");
  const qtyInput = document.getElementById("transferQty");
  const availInfo = document.getElementById("availableInfo");

  const whForm = document.getElementById("warehouseForm");
  const whName = document.getElementById("warehouseName");
  const whList = document.getElementById("warehouseList");

  function fillProducts() {
    const prev = prodSel.value;
    prodSel.innerHTML = "";
    Store.getProducts()
      .filter((p) => !Store.isBajoPedido(p) && Store.totalStock(p) > 0)
      .forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.sku} — ${p.nombre}`;
        prodSel.appendChild(opt);
      });
    if ([...prodSel.options].some((o) => o.value === prev)) prodSel.value = prev;
    updateAvailable();
  }

  function fillWarehouseSelects() {
    [fromSel, toSel].forEach((sel) => {
      const prev = sel.value;
      sel.innerHTML = "";
      Store.getWarehouses().forEach((w) => {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        sel.appendChild(opt);
      });
      if ([...sel.options].some((o) => o.value === prev)) sel.value = prev;
    });
    renderWarehouses();
    updateAvailable();
  }

  function updateAvailable() {
    const p = Store.getProduct(prodSel.value);
    if (!p) {
      availInfo.textContent = "No hay productos con stock para trasladar.";
      return;
    }
    availInfo.textContent = `Disponible en ${fromSel.value}: ${p.stock[fromSel.value] || 0} u.`;
  }

  [prodSel, fromSel].forEach((el) => el.addEventListener("change", updateAvailable));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = Store.transfer(prodSel.value, fromSel.value, toSel.value, qtyInput.value);
    toast(res.msg, res.ok);
    if (res.ok) {
      qtyInput.value = 1;
      fillProducts();
      renderMovements();
    }
  });

  /* ---- Gestión de bodegas (agregar / eliminar) ---- */
  function renderWarehouses() {
    whList.innerHTML = Store.getWarehouses().map((w) => `
      <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-secondary">
        <span class="d-flex align-items-center gap-2">${icon("package")}${w}</span>
        <button type="button" class="btn btn-outline-danger btn-sm py-0" data-warehouse="${w}" aria-label="Eliminar ${w}">${icon("trash")}</button>
      </li>`).join("");

    whList.querySelectorAll("button[data-warehouse]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const w = btn.dataset.warehouse;
        if (!window.confirm(`¿Eliminar la bodega "${w}"? Se quitará del sistema junto con su stock registrado.`)) return;
        const res = Store.removeWarehouse(w);
        toast(res.msg, res.ok);
        if (res.ok) {
          fillWarehouseSelects();
          fillProducts();
          renderMovements();
        }
      });
    });
  }

  whForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = Store.addWarehouse(whName.value);
    toast(res.msg, res.ok);
    if (res.ok) {
      whName.value = "";
      fillWarehouseSelects();
      fillProducts();
    }
  });

  /* ---- Historial de movimientos ---- */
  function renderMovements() {
    const tbody = document.getElementById("movementsBody");
    const movs = Store.getMovements();
    tbody.innerHTML = movs.length
      ? movs.map((m) => `
          <tr>
            <td class="text-secondary">${fechaCorta(m.fecha)}</td>
            <td>${m.producto}</td>
            <td><span class="badge ${m.tipo === "traslado" ? "badge-soft-warning" : "badge-soft-success"}">${m.tipo === "traslado" ? "Traslado" : "Ingreso"}</span></td>
            <td class="text-secondary">${m.origen} -&gt; ${m.destino}</td>
            <td class="text-end fw-bold">${m.unidades}</td>
            <td class="text-secondary">${m.usuario}</td>
          </tr>`).join("")
      : `<tr><td colspan="6" class="text-center text-secondary py-3">Aún no hay movimientos registrados.</td></tr>`;
  }

  fillProducts();
  fillWarehouseSelects();
  renderMovements();
});
