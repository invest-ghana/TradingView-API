import { CommodityData } from "./base";

const instrument = "XAU_USD";
class XAU_USD extends CommodityData {
  constructor() {
    super();
    this.instrument = instrument;
    this.stopLossPips = 150;
  }
}

export const xau_usd = new XAU_USD();
