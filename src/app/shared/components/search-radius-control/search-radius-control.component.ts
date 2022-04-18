import { Component, Output, EventEmitter, Input } from '@angular/core';

import {
  incrementRadius,
  decrementRadius,
  decrementRadiusInSmallerScheme,
  incrementRadiusInSmallerScheme
} from '../../utils/map-radius.util';
import { MetersToKilometersPipe } from '../../pipes/meters-to-kilometers.pipe';

@Component({
  selector: 'app-search-radius-control',
  templateUrl: './search-radius-control.component.html',
  styleUrls: ['./search-radius-control.component.css'],
  providers: [MetersToKilometersPipe],
})
export class SearchRadiusControlComponent {
  @Input()
  schema: 'smaller' | 'default';
  @Input()
  giveRadiusExceededFeedback: boolean;
  @Input()
  locationPrefix: string = '';
  @Input()
  searchRadius: number;

  @Output() searchRadiusChange: EventEmitter<number> = new EventEmitter<number>();

  name: string = 'search-radius-control-component';

  error: string;

  constructor(
    private metersToKilometersPipe: MetersToKilometersPipe
  ) {}

  decrementRadius(): void {
    this.error = null;
    this.searchRadius = this.schema === 'smaller'
      ? decrementRadiusInSmallerScheme(this.searchRadius)
      : decrementRadius(this.searchRadius);
    this.searchRadiusChange.emit(this.searchRadius);
  }

  incrementRadius(): void {
    const prevSearchRadius = this.searchRadius;

    this.searchRadius = this.schema === 'smaller'
      ? incrementRadiusInSmallerScheme(this.searchRadius)
      : incrementRadius(this.searchRadius);
    this.searchRadiusChange.emit(this.searchRadius);

    if (
      this.giveRadiusExceededFeedback &&
      this.searchRadius === prevSearchRadius &&
      prevSearchRadius > 1000
    ) {
      this.error = `Der Radius kann maximal ${this.metersToKilometersPipe.transform(this.searchRadius)} betragen.`;
    } else {
      this.error = null;
    }
  }
}
