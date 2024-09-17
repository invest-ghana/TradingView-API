import { PricePeriod } from "../../../chart/session";

export const analyzeTrend = (candlesticks: PricePeriod[]) => {
  if (!Array.isArray(candlesticks) || candlesticks.length === 0) {
    return "Invalid pricePeriods data";
  }

  let bullishCount = 0;
  let bearishCount = 0;

  // Assuming each pricePeriod is an object { open, high, low, close }
  candlesticks.forEach((pricePeriod) => {
    if (pricePeriod.close > pricePeriod.open) {
      bullishCount++;
    } else if (pricePeriod.close < pricePeriod.open) {
      bearishCount++;
    }
    // if pricePeriod.close is equal to pricePeriod.open, it's considered neutral and not counted
  });

  // Determine the trend based on counts
  if (bullishCount > bearishCount) {
    return "Bullish";
  } else if (bullishCount < bearishCount) {
    return "Bearish";
  } else {
    return "Neutral";
  }
};

export const isCandleStickBullish = (candlestick: PricePeriod) => {
  return candlestick.close > candlestick.open;
}

export const isCandleStickBullishTrend = (candlesticks: PricePeriod[]) => {
  return analyzeTrend(candlesticks) === "Bullish"
}