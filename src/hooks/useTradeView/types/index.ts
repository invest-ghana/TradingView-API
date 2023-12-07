import { PricePeriod, MarketInfos } from "../../../chart/session";
import { TimeFrame } from "../../../types";

/* Considering the conditions with the maximum requirement, you'd need at least 30 previous 
  candlesticks to ensure all conditions can be checked. 
  However, this number can be adjusted based on your specific strategy and the timeframe you're trading on. 
  If you're trading on a higher timeframe (like daily or weekly), you might want to consider more periods to capture significant price action. 
  If you're on a lower timeframe (like 1H or 15M), 30 periods might be sufficient. */
export const NUM_ON_PREV_PERIODS = 80;

export type TradeAction = "buy" | "sell" | "hold";

export interface Subsession {
  id: string;
  description: string;
  private: boolean;
  session: string;
  "session-correction": string;
  "session-display": string;
}

export interface TradeDecision {
  instrument?: string;
  action: TradeAction;
  stopLoss: number; // To Be Deprecated
  takeProfit: number; // To Be Deprecated
  tradeConditionsResults?: TradeConditionsResult[];
  isBullish?: boolean;
  execute?: {
    stopLoss: number;
    takeProfit: number;
    currentPrice: number;
    units: number
    riskPerTrade: number
    stopLossPips: number
    riskFactor: number
    takeProfitPips: number
    pipValue: number
  }
}
export interface TradeConditionsResult {
  description: string;
  dataTested: string;
  passed: boolean;
}

export interface GetChartClientReturn {
  closeSession: () => void;
}

export interface ChartField {
  periods: PricePeriod[];
  infos: MarketInfos;
}

export interface QuoteField {
  currentPrice: number;
  askPrice: number;
  bidPrice: number;
  high: number;
  open: number;
  low: number;
  prevClosePrice: number;
  isTradable: boolean;
  time: number;
  priceScale: number;
  volume: number;
}

export interface ForexDataProps {
  chartField?: ChartField;
  quoteField?: QuoteField;
  tradeDecision?: TradeDecision;
}

export interface TradingViewClientProps {
  source?: string;
  currency?: string;
  timeframe?: TimeFrame;
  onError?: (err: Error) => void;
  onSymbolLoaded?: () => void;
  onChartUpdate?: (chart: ChartField) => void;
  onQuoteUpdate?: (quote: QuoteField) => void;
  checkTradeConditions?: (
    pricePeriod: PricePeriod,
    prevPricePeriods: PricePeriod[]
  ) => TradeDecision;
}
