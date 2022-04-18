import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EmbededAppartment } from '../../../../core/models/embeded-appartment.model';
import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-property-detail-apartment-list-item',
  templateUrl: './property-detail-apartment-list-item.component.html',
  styleUrls: ['./property-detail-apartment-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApartmentListItemComponent {
  @Input() defaultTitle: string;
  @Input() apartment: EmbededAppartment;

  @Output() openApartment: EventEmitter<EmbededAppartment> = new EventEmitter<EmbededAppartment>();

  public _name = 'property-detail-apartment-list-item';

  public get priceLabel(): string {
    return this.apartment.isStatusForSale
      ? 'Kaufpreis'
      : !this.apartment.isStatusNotActiveYet
        ? 'Schätzwert'
        : 'Schätzwert ab';
  }

  public get title(): string {
    return this.apartment.Title ? this.apartment.Title : this.defaultTitle;
  }

  public get numberOfLines(): number {
    return isSmallMobileDevice() ? 2 : 1;
  }

  public goToApartment(): void {
    this.openApartment.emit(this.apartment);
  }
}
