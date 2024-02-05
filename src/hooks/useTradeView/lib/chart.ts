import { GetChartClientReturn, TradingViewClientProps } from "../types";
import Client from "../../../client";

const replayData = [
  1690793400, //'Mon Jul 31 2023 08:5 
  1691414720, //Mon Aug 07 2023 13:25 
  1691542800, //Wed Aug 09 2023 01:00 
  1692278100, //Thu Aug 17 2023 13:15 
  1692578100, //Mon Aug 21 2023 00:35 
  1692583200, //Mon Aug 21 2023 02:00 
  1692629100, //Mon Aug 21 2023 14:45 
  1692712500, //Tue Aug 22 2023 13:55 
  1692830700, //Wed Aug 23 2023 22:45 
  1692859800, //Thu Aug 24 2023 06:50 
  1694386800, //Sun Sep 10 2023 23:00 
  1699890300, //Mon Nov 13 2023 15:45
  1700017500, //Wed Nov 15 2023 03:05
  1691414700, //Mon Aug 07 2023 13:25
  1700035500, //Wed Nov 15 2023 08:05
  1700111700, //Thu Nov 16 2023 05:15
  1700114700, //Thu Nov 16 2023 06:05
  1700118000, //Thu Nov 16 2023 07:00
  1700213700, //Fri Nov 17 2023 09:35
  1700214000, //Fri Nov 17 2023 09:40
  1700216100, //Fri Nov 17 2023 10:15
  1700216700, //Fri Nov 17 2023 10:25
  1700438400, //Mon Nov 20 2023 00:00
  1700468400, //Mon Nov 20 2023 08:20
  1700479800, //Mon Nov 20 2023 11:30
  1700487300, //Mon Nov 20 2023 13:35
  1700490600, //Mon Nov 20 2023 14:30
  1700524200, //Mon Nov 20 2023 23:50
  1700524800, //Tue Nov 21 2023 00:00
  1700553900, //Tue Nov 21 2023 08:05
  1700556600, //Tue Nov 21 2023 08:50
  1700616300, //Wed Nov 22 2023 01:25
  1700640600, //Wed Nov 22 2023 08:10
  1700744100, //Thu Nov 23 2023 12:55
  1700745600, //Thu Nov 23 2023 13:20
  1700821200, //Fri Nov 24 2023 10:20
  1700827800, //Fri Nov 24 2023 12:10
  1701132600, //Tue Nov 28 2023 00:50
  1701177300, //Tue Nov 28 2023 13:15
  1701178500, //Tue Nov 28 2023 13:35
  1701219600, //Wed Nov 29 2023 01:00
  1701310800, //Thu Nov 30 2023 02:20
  1701334500, //Thu Nov 30 2023 08:55
  1701355200, //Thu Nov 30 2023 14:40
  1701447300, //Fri Dec 01 2023 16:15
  1701673500, //Mon Dec 04 2023 07:05
  1701791400, //Tue Dec 05 2023 15:50
  1701843900, //Wed Dec 06 2023 06:25
  1701847500, //Wed Dec 06 2023 07:25
  1701849300, //Wed Dec 06 2023 07:55
  1701935100, //Thu Dec 07 2023 07:45
  1701938700, //Thu Dec 07 2023 08:45
];
export const getChartClient = ({
  source = "OANDA",
  currency = "XAUUSD",
  timeframe = "5",
  replayTimestamp = undefined,
  range = 100,
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
  const quoteSessionMarket = new quoteSession.Market(`${source}:${currency}`);
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
    replay: replayTimestamp, //1704444900 + 5 * 60, //gold
    range,
  });
  chart.onError(onError);

  chart.onSymbolLoaded(onSymbolLoaded);

  chart.onUpdate(() => {
    onChartUpdate?.(chart);
  });
  return { closeSession } as any;
};
