// Configuración para instrumentos del mercado argentino
export const BYMA_CONFIG = {
  // Acciones argentinas
  ACCIONES_ARG: ["GGAL", "LOMA", "PAMP"],

  // CEDEARs (Certificados de Depósito Argentinos)
  ACCIONES_CEDEARS: ["AAPL", "MELI"],

  // Bonos argentinos
  BONOS: ["AL30", "AL35"],

  // Índices y ETFs
  INDICES: ["SPY", "QQQ"], // QQQ representa al NASDAQ

  // Mapeo de símbolos a nombres completos
  SYMBOL_NAMES: {
    // Acciones argentinas
    GGAL: "Grupo Financiero Galicia",
    LOMA: "Loma Negra",
    PAMP: "Pampa Energía",

    // CEDEARs
    AAPL: "Apple Inc. CEDEAR",
    MELI: "MercadoLibre Inc. CEDEAR",

    // Bonos
    AL30: "Bono Argentino 2030 USD",
    AL35: "Bono Argentino 2035 USD",

    // Índices y ETFs
    SPY: "S&P 500 ETF",
    QQQ: "NASDAQ-100 ETF",
  },
}
