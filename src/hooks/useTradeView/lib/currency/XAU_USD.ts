import { BaseInstrumentData, CommodityData } from "./base";

const instrument = "XAU_USD";
class XAU_USD extends CommodityData {
  constructor() {
    super();
    this.instrument = instrument;
  }
}

export const xau_usd = new XAU_USD();
