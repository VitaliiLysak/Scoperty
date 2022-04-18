import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'costPerM2',
})
export class CostPerM2Pipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: number, symbol?: string): string {
    const val = Number(value);
    if (!Number.isNaN(val) && val > 0) {
      return `${this.currencyPipe.transform(value, 'EUR', 'symbol', '1.0-10')}/m²`;
    } else if (symbol) {
      return symbol;
    } else {
      return '-';
    }
  }
}
