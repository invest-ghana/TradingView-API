import { FOREXTYPE, InstrumentDataType, TradeDecision } from "../../types";

export class BaseInstrumentData implements InstrumentDataType {
  type: FOREXTYPE;
  riskPerTrade: number;
  riskFactor: number;
  stopLossPips: number;
  pipValue: number;
  instrument: string;
  decimalPlaces: number;
  lotSizeValue: {
    standard: number;
    mini: number;
    micro: number;
  };

  constructor(type: FOREXTYPE) {
    this.type = type;
    this.riskPerTrade = 0.01; // 1% risk per trade
    this.riskFactor = 3; // 1:4 risk factor
    this.stopLossPips = 15; // Default stoplossPips
    this.lotSizeValue = { standard: 0, mini: 0, micro: 0 }; // Initialized with default values
  }

  get takeProfitPips(): number {
    return this.riskFactor * this.stopLossPips;
  }

  get pipAmount(): number {
    return this.pipValue * this.lotSizeValue.mini;
  }

  getUnits(balance: number, currentPrice: number): number {
    const riskAmount = balance * this.riskPerTrade;
    const moneyRiskedPerPip = riskAmount / this.stopLossPips;
    const unitsRisked =
      (moneyRiskedPerPip / this.pipAmount) * this.lotSizeValue.mini;

    const leveragedPricePerUnit = currentPrice / 30; // With 30:1 leverage
    const maxUnitsWithBalance = balance / leveragedPricePerUnit; // Maximum units within balance
    const feasibleUnits = Math.min(maxUnitsWithBalance, unitsRisked); // Adjust to the lower
    return Math.round(feasibleUnits);
  }

  getSLTP(
    currentPrice: number,
    isBullish: boolean
  ): { stopLoss: number; takeProfit: number } {
    let stopLoss, takeProfit;
    if (isBullish) {
      stopLoss = currentPrice - this.stopLossPips * this.pipValue;
      takeProfit = currentPrice + this.takeProfitPips * this.pipValue;
    } else {
      stopLoss = currentPrice + this.stopLossPips * this.pipValue;
      takeProfit = currentPrice - this.takeProfitPips * this.pipValue;
    }
    stopLoss = Number(stopLoss.toFixed(this.decimalPlaces));
    takeProfit = Number(takeProfit.toFixed(this.decimalPlaces));
    return { stopLoss, takeProfit };
  }

  updateTradeDecisionData(tradeDecision: TradeDecision, currentPrice) {
    const units = this.getUnits(tradeDecision?.balance, currentPrice);

    const { stopLoss, takeProfit } = this.getSLTP(
      tradeDecision?.currentPrice,
      tradeDecision.isBullish
    );

    tradeDecision = {
      ...tradeDecision,
      stopLoss,
      takeProfit,
      units,
      riskPerTrade: this.riskPerTrade,
      stopLossPips: this.stopLossPips,
      riskFactor: this.riskFactor,
      takeProfitPips: this.takeProfitPips,
      pipValue: this.pipValue,
      pipAmount: this.pipAmount,
    };
    return tradeDecision;
  }

  prepareTextToEmail(tradeDecision: TradeDecision): {
    text: string;
    html: string;
  } {
    const { stopLoss, takeProfit } = this.getSLTP(
      tradeDecision?.currentPrice,
      tradeDecision?.isBullish
    );
    const periodTested = tradeDecision.pricePeriodTested;
    const text = `Ready to trade: ${
      tradeDecision?.action
    }Stoploss: ${stopLoss} | TakeProfit: ${takeProfit}
              CandleStick -> Date: ${new Date(
                periodTested.time * 1000
              )} High: ${periodTested.max} | Open:  ${
      periodTested.open
    } | Close: ${periodTested.close} | Low: ${periodTested.min} `; // plain text body
    const html = `Ready to trade:
        <br>CandleStick -> Date: ${new Date(periodTested.time * 1000)}
        <br>High: ${periodTested.max} | Open:  ${periodTested.open} | Close: ${
      periodTested.close
    } | Low: ${periodTested.min}   
        <br>trade action: ${tradeDecision?.action}  
        <br>stoploss: ${stopLoss}  
        <br>takeProfit: ${takeProfit}  
        <br>
        <br>currentPrice: ${tradeDecision?.currentPrice}
        <br>units: ${tradeDecision.units}
      `;
    return { text, html };
  }
  prepareCandlestickDataForParse(tradeDecision: TradeDecision) {
    const { stopLoss, takeProfit } = this.getSLTP(
      tradeDecision?.currentPrice,
      tradeDecision?.isBullish
    );
    const periodTested = tradeDecision.pricePeriodTested;
    const candlestickData = {
      time: periodTested.time,
      timeString: new Date(periodTested.time * 1000).toISOString(),
      open: periodTested.open,
      high: periodTested.max,
      low: periodTested.min,
      close: periodTested.close,
      volume: periodTested.volume,
      decision: tradeDecision.action,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      units: tradeDecision.units,
      riskPerTrade: tradeDecision.riskPerTrade,
      stopLossPips: tradeDecision.stopLossPips,
      riskFactor: tradeDecision.riskFactor,
      takeProfitPips: tradeDecision.takeProfitPips,
      pipValue: tradeDecision.pipValue,
      pipAmount: tradeDecision.pipAmount,
      currentPrice: tradeDecision.currentPrice,
      instrument: tradeDecision.instrument,
    };
    return candlestickData;
  }
}

export class CurrencyData extends BaseInstrumentData {
  constructor() {
    super(FOREXTYPE.CURRENCY);
    this.pipValue = 0.0001;
    this.decimalPlaces = 5;
    this.lotSizeValue = {
      standard: 100000,
      mini: 10000,
      micro: 1000,
    };
  }
}

export class CommodityData extends BaseInstrumentData {
  constructor() {
    super(FOREXTYPE.COMMODITY);
    this.pipValue = 0.01;
    this.decimalPlaces = 2;

    this.lotSizeValue = {
      standard: 100,
      mini: 10,
      micro: 1,
    };
  }
}
