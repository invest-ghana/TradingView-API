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
  tradeConditionsResults?: TradeConditionsResult[];
  isBullish?: boolean;
  isBullishTrade?: boolean;
  pricePeriodTested?: PricePeriod;
  prevPricePeriods?: PricePeriod[];
  balance?: number;
  stopLoss?: number;
  takeProfit?: number;
  currentPrice?: number;
  leverage?: number;
  units?: number;
  riskPerTrade?: number;
  stopLossPips?: number;
  riskFactor?: number;
  takeProfitPips?: number;
  pipValue?: number;
  pipAmount?: number;
  marginRate?: number;
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
  replayTimestamp?: number; //Replay mode starting point (Timestamp) ex: 1703669100 + 5 * 60
  range?: number; // How many candlesticks to fetch. use - to get candlesticks after the timestamp
  onError?: (err: Error) => void;
  onSymbolLoaded?: () => void;
  onChartUpdate?: (chart: ChartField) => void;
  onQuoteUpdate?: (quote: QuoteField) => void;
  checkTradeConditions?: (
    pricePeriod: PricePeriod,
    prevPricePeriods: PricePeriod[]
  ) => TradeDecision;
}

export const enum FOREXTYPE {
  CURRENCY, // EUR_USD
  COMMODITY, // XAU_USD
}
export interface InstrumentDataType {
  type: FOREXTYPE;
  riskPerTrade: number; // 1% risk per trade
  stopLossPips: number; // Adjusted for XAU/USD (e.g., 10 pips)
  riskFactor: number; // 1:4 risk factor
  takeProfitPips: number; // this.riskFactor * this.stopLossPips
  pipValue: number; // Adjusted Pip value for a mini lot in XAU/USD
  pipAmount: number; // Adjusted Pip value for a mini lot in XAU/USD
  lotSizeValue: {
    standard: number;
    mini: number;
    micro: number;
  };
  instrument: string;
  decimalPlaces: number; //ex: 1.07927
  marginRate?: number; //ex: 0.05. this value is read from oanda api for the specific instrument
}
