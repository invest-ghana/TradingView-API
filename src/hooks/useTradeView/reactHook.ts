import { useEffect, useMemo, useState } from "react";
import { getChartClient } from "./lib/chart";
import {
  ChartField,
  GetChartClientReturn,
  NUM_ON_PREV_PERIODS,
  QuoteField,
  TradeDecision,
  TradingViewClientProps,
} from "./types";
import { PricePeriod } from "../../chart/session";

export const useTradeView = (props?: TradingViewClientProps) => {
  const { onChartUpdate, onQuoteUpdate, checkTradeConditions } = props ?? {};

  const [chartClient, setChartClient] = useState<GetChartClientReturn>();
  const [chartField, setChartField] = useState<ChartField>();
  const [quoteField, setQuoteField] = useState<QuoteField>();
  const [tradeDecision, setTradeDecision] = useState<TradeDecision>();
  const [alreadyCheckedPeriod, setAlreadyCheckedPeriod] =
    useState<PricePeriod>();

  useEffect(() => {
    const chartclient = getChartClient({
      onChartUpdate(chartField) {
        onChartUpdate?.(chartField);
        console.log("this one instead");
        setChartField(chartField);
      },
      onQuoteUpdate(quote) {
        onQuoteUpdate?.(quote);
        setQuoteField(quote);
      },
    });
    setChartClient(chartclient);
  }, []);

  useEffect(() => {
    if (!checkTradeConditions) {
      console.log("Missing trading algorithm");
      return;
    }
    const periods = chartField?.periods ?? [];
    if (periods.length < NUM_ON_PREV_PERIODS) {
      console.log("Error in fetched periods");
      return;
    }

    /* Since the trade execution happens on a candle stick after the one that meets the condition,
    for a given candlestick, we test the previous one to see if it met the condition, and if so 
    we begin tracking the current price to see if it, for a buy, exceeds the close, or for a sell, 
    goes below the close, in order to intiate the trade. 
    We only need to check ones, so we store the tested candlestick and if we get a new one, we check again*/
    const periodToTest = periods[1];
    if (periodToTest.time === alreadyCheckedPeriod?.time) {
      return;
    }

    setAlreadyCheckedPeriod(periodToTest);
    const prevPeriods: PricePeriod[] = periods.slice(2, NUM_ON_PREV_PERIODS);
    const tradeDecision = checkTradeConditions(periodToTest, prevPeriods);
    setAlreadyCheckedPeriod(periodToTest);

    setTradeDecision(tradeDecision);
  }, [chartField, checkTradeConditions]);

  const shouldExecute = useMemo<boolean>(() => {
    if (tradeDecision?.action === "hold") {
      return false;
    }
    const matchedPeriod = chartField?.periods[0];
    return (
      (tradeDecision?.isBullish &&
        Number(quoteField?.currentPrice) > Number(matchedPeriod?.close)) ||
      (!tradeDecision?.isBullish &&
        Number(quoteField?.currentPrice) < Number(matchedPeriod?.close))
    );
  }, [
    chartField?.periods,
    quoteField?.currentPrice,
    tradeDecision?.action,
    tradeDecision?.isBullish,
  ]);
  useEffect(() => {
    if (tradeDecision?.action === "hold") {
      return;
    }
    console.log("Ready to trade");
  }, [tradeDecision]);

  return { chartClient, chartField, quoteField, tradeDecision, shouldExecute };
};

