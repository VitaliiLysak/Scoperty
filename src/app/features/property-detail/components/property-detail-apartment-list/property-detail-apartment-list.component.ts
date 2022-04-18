import {
  Component,
  Inject,
  Input,
} from '@angular/core';
import {
  Params,
  Router,
  UrlSerializer
} from '@angular/router';

import {
  ApartmentStateMap,
  ExtendedMarkerModel,
} from '../../../../core/models/extended-marker.model';
import { templateStatusToFrontend } from '../../../../shared/utils/deserializator.util';
import { WINDOW } from '../../../../core/services/window.provider';
import { EmbededAppartment } from '../../../../core/models/embeded-appartment.model';
import {
  SellingStatusFE,
  SHARED_ROUTES_NAMES,
} from '../../../../app.constants';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { TRACKING_QUERY_PARAMS } from '../../../../shared/utils/get-tracking-query-params.util';

@Component({
  selector: 'app-property-detail-apartment-list',
  templateUrl: './property-detail-apartment-list.component.html',
  styleUrls: ['./property-detail-apartment-list.component.css']
})
export class ApartmentListComponent {
  @Input() marker: ExtendedMarkerModel;

  public _name = 'property-detail-apartment-list';

  private forSaleOrOpenForOffers: SellingStatusFE[] = [
    'ForSale',
    'MakeMeMove',
  ];

  get apartmentMapKeys(): string[] {
    return Object.keys(this.marker.apartmentStateMap);
  }

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
    private stateManagerService: StateManagerService,
    @Inject(WINDOW) private window: Window,
    @Inject(TRACKING_QUERY_PARAMS) private trackingQueryParams: Params,
  ) {}

  isForSaleOrMakeMeMoveStatus(key: string): boolean {
    return this.forSaleOrOpenForOffers.includes(key as SellingStatusFE);
  }

  isForSaleStatus(key: string): boolean {
    return key === this.forSaleOrOpenForOffers[0];
  }

  getApartmentsForKey(key: string): EmbededAppartment[] {
    return this.marker.getApartmentsForKey(key as keyof ApartmentStateMap);
  }

  hasNoApartmentsForKey(key: string): boolean {
    const apartmentsLength = this.marker.getNumberOfApartmentsForKey(key as keyof ApartmentStateMap);
    return apartmentsLength < 1;
  }

  public frontendStatus(status: string): string {
    return templateStatusToFrontend(status);
  }

  public getApartmentTitle(key: string): string {
    const apartmentsLength = this.marker.getNumberOfApartmentsForKey(key as keyof ApartmentStateMap);

    return apartmentsLength > 1
      ? `${apartmentsLength} Wohnungen`
      : `${apartmentsLength} Wohnung`;
  }

  setQueryParams(apartment: EmbededAppartment): Params {
    if (apartment.isStatusMakeMeMove) {
      return {
        property_type: 'multi_family_house',
        selling_status: 'make_me_move'
      };
    } else {
      return this.trackingQueryParams;
    }
  }

  public goToApartment(apartment: EmbededAppartment): void {
    if (apartment.hasUrl) {
      this.window.open(apartment.Url, '_blank');
      return;
    }
    if (!apartment.isStatusNotActiveYet) {
      const path = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}/${apartment.id}`;
      const tree = this.router.createUrlTree([path], { queryParams: this.setQueryParams(apartment) });
      const url = this.serializer.serialize(tree);

      this.window.open(url, '_blank');
    }
  }
}
