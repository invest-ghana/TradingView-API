import { CurrencyData } from "./base";

const instrument = "EUR_USD";
class EUR_USD extends CurrencyData {
  constructor() {
    super();
    this.instrument = instrument;
  }
}

export const eur_usd = new EUR_USD();
