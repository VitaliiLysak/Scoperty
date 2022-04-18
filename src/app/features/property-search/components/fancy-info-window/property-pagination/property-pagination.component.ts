import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PropertyDetailData } from '../../../../../core/models/properties-repository.model';
import { isNullOrUndefined } from '../../../../../shared/utils/null-or-undefined.util';

@Component({
  selector: 'app-property-pagination',
  templateUrl: './property-pagination.component.html',
  styleUrls: ['./property-pagination.component.css'],
})
export class PropertyPaginationComponent {

  @Input() propertyDetailData: PropertyDetailData[] = [];
  @Input() index: number = 0;
  @Input() scrapedWithoutAddressGroupedQuantity: number;

  @Output() change: EventEmitter<number> = new EventEmitter<number>();

  name: string = 'property-pagination';

  counter: number = 0;

  get propertyDetailDataLength(): number {
    return !isNullOrUndefined(this.scrapedWithoutAddressGroupedQuantity)
      ? this.scrapedWithoutAddressGroupedQuantity
      : this.propertyDetailData.length;
  }

  next(): void {
    const total = this.propertyDetailData.length - 1;
    this.counter = this.inc(total);
    this.index = this.counter;
    this.change.emit(this.counter);
  }

  prev(): void {
    const total = this.propertyDetailData.length - 1;
    this.counter = this.dec(total);
    this.index = this.counter;
    this.change.emit(this.counter);
  }

  inc(total: number): number {
    return (this.counter < total ) ? this.counter + 1 : 0;
  }

  dec(total: number): number {
    return (this.counter > 0 ) ? this.counter - 1 : total;
  }

}
