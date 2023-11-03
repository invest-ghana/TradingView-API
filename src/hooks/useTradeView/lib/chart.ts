import { GetChartClientReturn, TradingViewClientProps } from "../types";
import Client from '../../../client';

const replayData = [
  1690793400, //July 31, 2023 | 8:50 UTC
  1691414720, //Aug, 7, 2023 | 13:25 UTC
  1691542800, //Aug, 9, 2023 | 1:25 UTC
  1692278100, //Aug, 17, 2023 | 13:15 UTC
  1692578100, //Aug, 21, 2023 | 12:35 UTC
  1692583200, //Aug, 21, 2023 | 2:00 UTC
  1692629100, //Aug, 21, 2023 | 14:45 UTC
  1692712500, //Aug, 22, 2023 | 13:55 UTC
  1692830700, //Aug, 23, 2023 | 20:45 UTC
  1692859800, //Aug, 23, 2023 | 6:50 UTC
  1694386800, //Sep, 10, 2023 | 23:00 UTC
];
export const getChartClient = ({
  source = "PEPPERSTONE",
  currency = "XAUUSD",
  timeframe = "5",
  onError = (...err) => {
    // Listen for errors (can avoid crash)
    console.error("Chart error:", ...err);
  },
  onSymbolLoaded = () => {
    // When the symbol is successfully loaded
    console.log(`Market  loaded !`);
  },
  onChartUpdate,
  onQuoteUpdate,
}: TradingViewClientProps): GetChartClientReturn => {
  
  const client = new Client(); // Creates a websocket client
  const quoteSession = new client.Session.Quote();
  const quoteSessionMarket = new quoteSession.Market("PEPPERSTONE:XAUUSD");
  quoteSessionMarket.onData(async (data: any) => {
    if (!!data?.lp) {
      onQuoteUpdate?.({
        currentPrice: data.lp,
        askPrice: data.ask,
        bidPrice: data.ask,
        high: data.high_price,
        open: data.open_price,
        low: data.low_price,
        prevClosePrice: data.prev_close_price,
        isTradable: data.is_tradable,
        time: data.lp_time,
        priceScale: data.pricescale,
        volume: data.volume,
      });
    }
  });
  const chart = new client.Session.Chart(); // Init a Chart session

  const closeSession = () => {
    chart.delete();
    client.end();
  };

  chart.setMarket(`${source}:${currency}`, {
    timeframe,
    // replay: replayData[1] + 5 * 60 ,
  });
  chart.onError(onError);

  chart.onSymbolLoaded(onSymbolLoaded);

  chart.onUpdate(() => {
    onChartUpdate?.(chart);
  });
  return { closeSession } as any;
};
