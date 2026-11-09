/* ============================================================
   BioGymStore — Store: estado de la aplicación + persistencia
   Todo se guarda en localStorage. Para reiniciar los datos
   de demostración desde la consola del navegador: Store.reset()
   ============================================================ */

const Store = (() => {
  const DB_KEY = "biogym_db_v1";
  const SESSION_KEY = "biogym_session";
  const LOW_STOCK = 3;

  let db;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  function init() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      db = raw ? JSON.parse(raw) : clone(SEED);
    } catch (e) {
      db = clone(SEED);
    }
  }

  function save() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  init();

  /* ---------- Sesión ---------- */

  function login(email, password) {
    const u = db.user;
    if (
      typeof email === "string" &&
      email.trim().toLowerCase() === u.email.toLowerCase() &&
      password === u.password
    ) {
      localStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return localStorage.getItem(SESSION_KEY) === "true";
  }

  function currentUser() {
    return db.user;
  }

  /* ---------- Productos ---------- */

  function getProducts() {
    return db.products.slice();
  }

  function getProduct(id) {
    return db.products.find((p) => p.id === Number(id)) || null;
  }

  function getCategories() {
    return db.categories.slice();
  }

  function totalStock(p) {
    return Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
  }

  function isBajoPedido(p) {
    return Boolean(p.bajoPedido);
  }

  // Estado general del producto
  function statusOf(p) {
    if (isBajoPedido(p)) return "pedido";
    const total = totalStock(p);
    if (total === 0) return "agotado";
    if (total <= LOW_STOCK) return "bajo";
    return "ok";
  }

  function skuExists(sku) {
    return db.products.some((p) => p.sku.toUpperCase() === String(sku).trim().toUpperCase());
  }

  function addProduct(data) {
    const id = Date.now();
    const stock = {};
    if (!data.bajoPedido) stock[data.destino] = Number(data.cantidad) || 0;
    const product = {
      id,
      sku: String(data.sku).trim().toUpperCase(),
      nombre: String(data.nombre).trim(),
      categoria: data.categoria,
      precio: Number(data.precio),
      descripcion: String(data.descripcion || "").trim(),
      imagen: String(data.imagen || "").trim(),
      icon: data.icon || "box",
      cajaUnits: Number(data.cajaUnits) || 0,
      stock
    };
    if (data.bajoPedido) product.bajoPedido = data.bajoPedido;
    db.products.push(product);
    if (!data.bajoPedido) {
      addMovement(product.nombre, "ingreso", "Ingreso manual", data.destino, product.stock[data.destino]);
    }
    save();
    return product;
  }

  function addStock(id, cantidad, destino) {
    const p = getProduct(id);
    if (!p) return { ok: false, msg: "Producto no encontrado." };
    cantidad = Number(cantidad);
    if (!(cantidad > 0)) return { ok: false, msg: "La cantidad debe ser mayor a 0." };
    p.stock[destino] = (p.stock[destino] || 0) + cantidad;
    addMovement(p.nombre, "ingreso", "Ingreso manual", destino, cantidad);
    save();
    return { ok: true, msg: `Se ingresaron ${cantidad} unidades a ${destino}.` };
  }

  /* ---------- Traslados ---------- */

  function transfer(id, from, to, cantidad) {
    const p = getProduct(id);
    if (!p) return { ok: false, msg: "Producto no encontrado." };
    cantidad = Number(cantidad);
    if (from === to) return { ok: false, msg: "El origen y el destino deben ser distintos." };
    if (!(cantidad > 0)) return { ok: false, msg: "La cantidad debe ser mayor a 0." };
    const disponible = p.stock[from] || 0;
    if (cantidad > disponible) {
      return { ok: false, msg: `Stock insuficiente en ${from} (disponible: ${disponible}).` };
    }
    p.stock[from] = disponible - cantidad;
    p.stock[to] = (p.stock[to] || 0) + cantidad;
    addMovement(p.nombre, "traslado", from, to, cantidad);
    save();
    return { ok: true, msg: `Traslado de ${cantidad} u. de ${from} a ${to} realizado.` };
  }

  /* ---------- Bodegas ---------- */

  function getWarehouses() {
    return db.warehouses.slice();
  }

  function addWarehouse(name) {
    name = String(name || "").trim();
    if (!name) return { ok: false, msg: "Ingrese un nombre para la bodega." };
    if (db.warehouses.some((w) => w.toLowerCase() === name.toLowerCase())) {
      return { ok: false, msg: "Ya existe una bodega con ese nombre." };
    }
    db.warehouses.push(name);
    db.products.forEach((p) => {
      if (!p.bajoPedido) p.stock[name] = 0;
    });
    save();
    return { ok: true, msg: `Bodega "${name}" creada correctamente.` };
  }

  function removeWarehouse(name) {
    if (db.warehouses.length <= 1) {
      return { ok: false, msg: "Debe existir al menos una bodega." };
    }
    db.warehouses = db.warehouses.filter((w) => w !== name);
    db.products.forEach((p) => {
      delete p.stock[name];
    });
    save();
    return { ok: true, msg: `Bodega "${name}" eliminada.` };
  }

  /* ---------- Movimientos (historial) ---------- */

  function addMovement(producto, tipo, origen, destino, unidades) {
    db.movements.unshift({
      id: Date.now() + Math.random(),
      fecha: new Date().toISOString(),
      producto,
      tipo,
      origen,
      destino,
      unidades: Number(unidades),
      usuario: db.user.nombre
    });
    if (db.movements.length > 50) db.movements.pop();
  }

  function getMovements() {
    return db.movements.slice();
  }

  /* ---------- Proveedores ---------- */

  function getSuppliers() {
    return db.suppliers.slice();
  }

  function getBajoPedido() {
    return db.products.filter((p) => p.bajoPedido);
  }

  /* ---------- Utilidades ---------- */

  function reset() {
    localStorage.removeItem(DB_KEY);
    init();
  }

  return {
    login, logout, isLoggedIn, currentUser,
    getProducts, getProduct, getCategories, totalStock, isBajoPedido, statusOf,
    skuExists, addProduct, addStock,
    transfer,
    getWarehouses, addWarehouse, removeWarehouse,
    getMovements,
    getSuppliers, getBajoPedido,
    reset, LOW_STOCK
  };
})();
