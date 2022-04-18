import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import {
  Router,
  UrlSerializer
} from '@angular/router';

import { ExtendedMarkerModel } from '../../../../../core/models/extended-marker.model';
import { WINDOW } from '../../../../../core/services/window.provider';
import { CostPipe } from '../../../../../shared/pipes/cost.pipe';
import { isNullOrUndefined } from '../../../../../shared/utils/null-or-undefined.util';
import { getEstimatedPriceText, getSalePriceText } from '../../../../../shared/utils/price-title.util';
import getTrackingQueryParams from '../../../../../shared/utils/get-tracking-query-params.util';
import { SHARED_ROUTES_NAMES } from '../../../../../app.constants';
import { PropertyDetailData } from '../../../../../core/models/properties-repository.model';

@Component({
  selector: 'app-property-view',
  templateUrl: './property-view.component.html',
  styleUrls: [
    './property-view.component.css',
  ],
})
export class PropertyViewComponent {
  name: string = 'property-view';

  @Input() indexPropertyPagination: number = 0;
  @Input() marker: ExtendedMarkerModel;
  @Input() propertyDetailData: PropertyDetailData[] = [];
  @Input() openWithoutAddress: boolean;
  @Input() scrapedWithoutAddressGroupedQuantity: number;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeProperty: EventEmitter<number> = new EventEmitter<number>();

  get propertyDetailButtonText(): string {
    return this.marker.isPropertyOfTypeMFH ? 'Zu den Wohnungen' : 'Zur Immobilie';
  }

  get isStatusForSale(): boolean {
    return this.marker.isStatusForSale;
  }

  get shouldShowEstimatedPrice(): boolean {
    if (this.marker.isScraped && this.marker.hasMatchedProperty && !isNullOrUndefined(this.marker.EstimatedPrice)) {
      return true;
    } else {
      return !this.marker.isScraped && this.marker.isStatusForSale;
    }
  }

  get hasImage(): boolean {
    return this.marker.images && this.marker.images.length > 0;
  }

  get matchedPropertyUrl(): string {
    return `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}/${this.marker.matchedProperty}`;
  }

  get image(): string {
    return this.hasImage ? this.marker.images[0] : null;
  }

  get title(): string {
    return this.marker.isPropertyOfTypeEFH
      ? 'Haus'
      : 'Mehrfamilienhaus';
  }

  get markerPrice(): number {
    return !isNullOrUndefined(this.marker.SalePrice) && this.marker.isStatusForSale
      ? this.marker.SalePrice
      : this.marker.price;
  }

  get showPagination(): boolean {
    return (this.propertyDetailData.length > 1 && this.openWithoutAddress === true) ||
      !isNullOrUndefined(this.scrapedWithoutAddressGroupedQuantity);
  }

  get estimatedPrice(): number {
    return this.marker.EstimatedPrice;
  }

  get statusShow(): boolean {
    return this.marker.isStatusForSale || this.marker.isStatusMakeMeMove;
  }

  get closeButtonColor(): string {
    return this.hasImage ? 'white' : 'primary-green';
  }

  get priceTitle(): string {
    return this.marker.isStatusForSale
      ? getSalePriceText(this.marker.PropertyType).toUpperCase()
      : getEstimatedPriceText(this.marker.PropertyType).toUpperCase();
  }

  get estimatedPriceTitle(): string {
    return getEstimatedPriceText(this.marker.PropertyType).toUpperCase();
  }

  constructor(
    private costPipe: CostPipe,
    private router: Router,
    private serializer: UrlSerializer,
    @Inject(WINDOW) private window: Window,
  ) {}

  closePopup(): void {
    this.close.emit();
  }

  onChange(index: number): void {
    this.changeProperty.emit(index);
  }

  goToPropertyDetail(): void {
    let queryParams = {};

    if (this.marker.isPropertyOfTypeMFH && this.marker.isStatusMakeMeMove) {
      queryParams = {
        property_type: 'multi_family_house',
        selling_status: 'make_me_move'
      };
    } else {
      queryParams = getTrackingQueryParams();
    }

    if (this.marker.hasUrl) {
      this.window.open(this.marker.Url, '_blank');
    } else {
      const path = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}/${this.marker.id}`;
      const tree = this.router.createUrlTree([path], { queryParams: queryParams });
      const url = this.serializer.serialize(tree);

      this.window.open(url, '_blank');
    }
  }
}
