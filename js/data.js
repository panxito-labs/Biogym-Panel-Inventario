/* ============================================================
   BioGymStore — Datos iniciales (semilla) del sistema
   Se cargan la primera vez que se abre la aplicación y luego
   se persisten en localStorage. Las miniaturas usan iconos
   SVG definidos en js/icons.js (campo "icon").
   ============================================================ */

const SEED = {
  user: {
    // Credenciales de DEMOSTRACIÓN (visibles a propósito).
    // Este proyecto es 100% frontend: cualquier login hecho en el navegador
    // es una simulación, no seguridad real. Proteger un acceso de verdad
    // requiere un backend. Ver README_DESPLIEGUE.md.
    email: "demo@biogym.cl",
    password: "demo1234",
    nombre: "Usuario Demo",
    rol: "Administrador (demo)",
    iniciales: "UD"
  },
  warehouses: ["Bodega Tienda", "Bodega Casa Jefe"],
  categories: ["Suplementos", "Pesas", "Indumentaria", "Accesorios", "Nutrición", "Barritas"],
  products: [
    {
      id: 1, sku: "BG-SUP-001", nombre: "Proteína Whey ISO 2kg", categoria: "Suplementos",
      precio: 34990, descripcion: "Whey proteína aislada, sabor chocolate, bolsa 2 kg.",
      icon: "zap", cajaUnits: 0,
      stock: { "Bodega Tienda": 45, "Bodega Casa Jefe": 10 }
    },
    {
      id: 2, sku: "BG-SUP-002", nombre: "Proteína Whey 2kg Vainilla", categoria: "Suplementos",
      precio: 29990, descripcion: "Whey proteína concentrada, sabor vainilla, bolsa 2 kg.",
      icon: "zap", cajaUnits: 0,
      stock: { "Bodega Tienda": 2, "Bodega Casa Jefe": 8 }
    },
    {
      id: 3, sku: "BG-SUP-010", nombre: "Creatina Ostrovit 500g", categoria: "Suplementos",
      precio: 19990, descripcion: "Creatina monohidrato en polvo, 500 g.",
      icon: "dumbbell", cajaUnits: 0,
      stock: { "Bodega Tienda": 0, "Bodega Casa Jefe": 6 }
    },
    {
      id: 4, sku: "BG-SUP-020", nombre: "Cafeína 200mg (60 cáps.)", categoria: "Suplementos",
      precio: 9990, descripcion: "Suplemento de cafeína anhidra, 60 cápsulas.",
      icon: "coffee", cajaUnits: 0,
      stock: { "Bodega Tienda": 3, "Bodega Casa Jefe": 0 }
    },
    {
      id: 5, sku: "BG-EQU-042", nombre: "Mancuerna Hexagonal 15kg", categoria: "Pesas",
      precio: 59990, descripcion: "Par de mancuernas hexagonales de 15 kg (c/u).",
      icon: "dumbbell", cajaUnits: 0,
      stock: { "Bodega Tienda": 4, "Bodega Casa Jefe": 0 }
    },
    {
      id: 6, sku: "BG-EQU-050", nombre: "Barra Olímpica 20kg", categoria: "Pesas",
      precio: 79990, descripcion: "Barra olímpica de 20 kg, 220 cm.",
      icon: "dumbbell", cajaUnits: 0,
      stock: { "Bodega Tienda": 6, "Bodega Casa Jefe": 2 }
    },
    {
      id: 7, sku: "BG-IND-030", nombre: "Polera Dry-Fit BioGym", categoria: "Indumentaria",
      precio: 9990, descripcion: "Polera deportiva transpirable, tallas S a XXL.",
      icon: "tag", cajaUnits: 0,
      stock: { "Bodega Tienda": 15, "Bodega Casa Jefe": 5 }
    },
    {
      id: 8, sku: "BG-NUT-005", nombre: "Barrita de Proteína", categoria: "Barritas",
      precio: 1490, descripcion: "Barrita de proteína sabor chocolate. Se despacha por caja de 24 unidades.",
      icon: "zap", cajaUnits: 24,
      stock: { "Bodega Tienda": 48, "Bodega Casa Jefe": 24 }
    },
    {
      id: 9, sku: "BG-ACC-012", nombre: "Correa de Levantamiento", categoria: "Accesorios",
      precio: 7990, descripcion: "Correa de soporte para levantamiento de pesas.",
      icon: "box", cajaUnits: 0,
      stock: { "Bodega Tienda": 12, "Bodega Casa Jefe": 4 }
    },
    {
      id: 10, sku: "BG-PED-001", nombre: "Báscula Deportiva Digital", categoria: "Accesorios",
      precio: 24990, descripcion: "Báscula digital de precisión. Sin stock propio: se pide a proveedor.",
      icon: "truck", cajaUnits: 0, bajoPedido: "Pesaschile",
      stock: {}
    }
  ],
  suppliers: [
    {
      id: 1, nombre: "Pesaschile", categoria: "Básculas y pesaje deportivo",
      web: "https://www.pesaschile.cl", contacto: "Pedido bajo cotización — Santiago"
    },
    {
      id: 2, nombre: "Proveedor indumentaria", categoria: "Indumentaria deportiva",
      web: "", contacto: "Sitio web por definir — Santiago"
    },
    {
      id: 3, nombre: "Proveedor suplementos", categoria: "Suplementos y nutrición",
      web: "", contacto: "Sitio web por definir — Santiago"
    },
    {
      id: 4, nombre: "Proveedor equipamiento", categoria: "Equipamiento de gimnasio",
      web: "", contacto: "Sitio web por definir — Santiago"
    }
  ],
  movements: []
};
