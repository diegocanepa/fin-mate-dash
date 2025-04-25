// Configuración para Alpha Vantage API
export const ALPHA_VANTAGE_CONFIG = {
  // Símbolos de acciones que queremos consultar
  STOCK_SYMBOLS: ["AAPL", "MELI", "GOOGL", "LOMA"],

  // Símbolos de bonos y ETFs que queremos consultar
  BOND_ETF_SYMBOLS: ["SPY", "QQQ", "GLD", "AGG"],

  // Mapeo de símbolos a nombres completos
  SYMBOL_NAMES: {
    AAPL: "Apple Inc.",
    MELI: "MercadoLibre, Inc.",
    GOOGL: "Alphabet Inc.",
    LOMA: "Loma Negra",
    SPY: "SPDR S&P 500 ETF",
    QQQ: "Invesco QQQ Trust (NASDAQ)",
    GLD: "SPDR Gold Shares",
    AGG: "iShares Core U.S. Aggregate Bond ETF",
  },
}
