export const XAUUSD = {
  riskPerTrade: 0.01, // 1% risk per trade
  stopLossPips: 50, // Adjusted for XAU/USD (e.g., 50 pips)
  riskFactor: 4, // 1:4 risk factor
  get takeProfitPips() {
    return this.riskFactor * this.stopLossPips;
  },
  pipValue: 0.1, // Adjusted Pip value for a mini lot in XAU/USD
  instrument: "XAU_USD",
  accountId: process.env.OANDA_ACCOUNT_ID,
  decimalPlaces: 2 //ex: 1985.75
};

export const EURUSD = {
  riskPerTrade: 0.01, // 1% risk per trade
  stopLossPips: 0.001, // Adjusted for XAU/USD (e.g., 10 pips)
  riskFactor: 4, // 1:4 risk factor
  get takeProfitPips() {
    return this.riskFactor * this.stopLossPips;
  },
  pipValue: 1, // Adjusted Pip value for a mini lot in XAU/USD
  instrument: "EUR_USD",
  accountId: process.env.OANDA_ACCOUNT_ID,
  decimalPlaces: 5 //ex: 1.07927
};
