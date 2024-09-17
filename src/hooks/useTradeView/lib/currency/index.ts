export * from "./base";
import { eur_usd } from "./EUR_USD";
import { xau_usd } from "./XAU_USD";
import { BaseInstrumentData } from "./base";

export enum INSTRUMENTS {
  XAU_USD = 'XAU_USD',
  EUR_USD = 'EUR_USD'
}
export const Instruments: { [x: string]: BaseInstrumentData } = {
  XAU_USD: xau_usd,
  EUR_USD: eur_usd,
};
