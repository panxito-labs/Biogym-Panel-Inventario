/* Página: ingreso-stock.html — ingreso a producto existente + creación de producto */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "ingreso-stock" || !Store.isLoggedIn()) return;

  const restockForm = document.getElementById("restockForm");
  const restockProduct = document.getElementById("restockProduct");
  const restockQty = document.getElementById("restockQty");
  const restockDest = document.getElementById("restockDest");
  const restockCajas = document.getElementById("restockCajas");

  const newForm = document.getElementById("newProductForm");
  const newCategory = document.getElementById("newCategory");
  const newDest = document.getElementById("newDest");
  const newImage = document.getElementById("newImage");
  const newPreview = document.getElementById("newPreview");

  /* ---- Select de productos (solo los con stock propio) ---- */
  function fillProductSelect() {
    const prev = restockProduct.value;
    restockProduct.innerHTML = "";
    Store.getProducts()
      .filter((p) => !Store.isBajoPedido(p))
      .forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.sku} — ${p.nombre} (total: ${Store.totalStock(p)} u.)`;
        restockProduct.appendChild(opt);
      });
    if ([...restockProduct.options].some((o) => o.value === prev)) restockProduct.value = prev;
    updateCajas();
  }

  /* ---- Selects de bodega (desplegables dinámicos) ---- */
  function fillWarehouseSelects() {
    [restockDest, newDest].forEach((sel) => {
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
  }

  /* ---- Recuento automático de cajas (ej: barritas por caja) ---- */
  function updateCajas() {
    const p = Store.getProduct(restockProduct.value);
    if (p && p.cajaUnits > 0) {
      const cajas = (Number(restockQty.value) || 0) / p.cajaUnits;
      restockCajas.textContent = `~ ${cajas.toFixed(2)} cajas de ${p.cajaUnits} u.`;
    } else {
      restockCajas.textContent = "";
    }
  }

  restockProduct.addEventListener("change", updateCajas);
  restockQty.addEventListener("input", updateCajas);

  restockForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = Store.addStock(restockProduct.value, restockQty.value, restockDest.value);
    toast(res.msg, res.ok);
    if (res.ok) {
      restockQty.value = 1;
      fillProductSelect();
    }
  });

  /* ---- Categorías del catálogo ---- */
  Store.getCategories().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    newCategory.appendChild(opt);
  });

  /* ---- Vista previa de imagen ---- */
  newImage.addEventListener("input", () => {
    const url = newImage.value.trim();
    if (/^https?:\/\//.test(url)) {
      newPreview.innerHTML = `<img src="${url}" alt="" class="thumb-img">`;
    } else {
      newPreview.innerHTML = icon("package");
    }
  });

  /* ---- Crear producto nuevo ---- */
  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const sku = document.getElementById("newSku").value;
    if (Store.skuExists(sku)) {
      toast(`El SKU ${sku.toUpperCase()} ya existe en el catálogo.`, false);
      return;
    }
    const precio = Number(document.getElementById("newPrice").value);
    if (!(precio >= 0)) {
      toast("Ingrese un precio válido.", false);
      return;
    }
    const product = Store.addProduct({
      nombre: document.getElementById("newName").value,
      sku,
      categoria: newCategory.value,
      precio,
      descripcion: document.getElementById("newDesc").value,
      imagen: newImage.value,
      icon: "box",
      cajaUnits: document.getElementById("newBoxUnits").value,
      cantidad: document.getElementById("newQty").value,
      destino: newDest.value
    });
    toast(`Producto "${product.nombre}" agregado al catálogo.`);
    newForm.reset();
    newPreview.innerHTML = icon("package");
    fillProductSelect();
    fillWarehouseSelects();
  });

  fillProductSelect();
  fillWarehouseSelects();
});
