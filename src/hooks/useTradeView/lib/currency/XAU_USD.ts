import { CommodityData } from "./base";

const instrument = "XAU_USD";
class XAU_USD extends CommodityData {
  constructor() {
    super();
    this.instrument = instrument;
    this.stopLossPips = 150;
    this.riskPerTrade = 0.1; // 10% risk per trade
  }
}

export const xau_usd = new XAU_USD();
