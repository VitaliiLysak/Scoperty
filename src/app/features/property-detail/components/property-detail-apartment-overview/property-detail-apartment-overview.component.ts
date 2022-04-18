import {
  Component,
  Input,
} from '@angular/core';

import { SellingStatusFE } from '../../../../app.constants';
import {
  ApartmentStateMap,
  ExtendedMarkerModel,
} from '../../../../core/models/extended-marker.model';

@Component({
  selector: 'app-property-detail-apartment-overview',
  templateUrl: './property-detail-apartment-overview.component.html',
  styleUrls: ['./property-detail-apartment-overview.component.css']
})
export class ApartmentOverviewComponent {
  @Input() marker: ExtendedMarkerModel;

  public _name: string = 'property-detail-apartment-overview';

  private forSaleOrOpenForOffers: SellingStatusFE[] = [
    'ForSale',
    'MakeMeMove',
  ];

  public get propertiesHeader(): string {
    return this.marker.NumberOfUnits > 1
      ? `${this.marker.NumberOfUnits} Wohnungen`
      : `${this.marker.NumberOfUnits} Wohnung`;
  }

  get apartmentMapKeys(): string[] {
    return Object.keys(this.marker.apartmentStateMap);
  }

  isSellingStatus(sellingStatus: string): boolean {
    return this.forSaleOrOpenForOffers.includes(sellingStatus as SellingStatusFE);
  }

  getNumberOfApartmentsForKey(key: string): number {
    return this.marker.getNumberOfApartmentsForKey(key as keyof ApartmentStateMap);
  }
}
