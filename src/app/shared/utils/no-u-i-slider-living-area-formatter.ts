import { NouiFormatter } from 'ng2-nouislider';

export class NoUISliderLivingAreaFormatter implements NouiFormatter {
  to(value: number) {
    return `${value.toFixed(0)} m${String.fromCharCode(0x00B2)}`;
  }

  from(value: string) {
    return parseInt(value.split(' ')[0], 10);
  }
}
