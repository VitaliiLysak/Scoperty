import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output, } from '@angular/core';
import { Params, Router, UrlSerializer } from '@angular/router';

import { WINDOW } from '../../../../core/services/window.provider';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { TRACKING_QUERY_PARAMS } from '../../../../shared/utils/get-tracking-query-params.util';

export interface PropertyActivateTabResult {
  tab: string;
  block: string;
  update: boolean;
}

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent {
  @Input() model: ExtendedMarkerModel;
  @Input() isActive: boolean;

  @Output() activateTab: EventEmitter<PropertyActivateTabResult> = new EventEmitter<PropertyActivateTabResult>();

  public _name: string = 'property';
  public linkToSearchBroker: string = `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`;

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public get isNotActiveYet(): boolean {
    return this.model.SellingStatus === 'NotActiveYet';
  }

  public get propertyAddress(): string {
    return (this.model.Street && this.model.HouseNumber && this.model.PostalCode && this.model.Locality) ?
      `${this.model.Street} ${this.model.HouseNumber}, ${this.model.PostalCode} ${this.model.Locality}` : '';
  }

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
    @Inject(WINDOW) private window: Window,
    @Inject(TRACKING_QUERY_PARAMS) private trackingQueryParams: Params,
  ) {}

  public emitActivateTab(tab: string, block: string): void {
    setTimeout(() => {
      this.activateTab.emit({ tab, block, update: true });
    }, 300);
  }

  public goToMarkerView(): void {
    event.stopPropagation();

    const path = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}/${this.model.id}`;
    const tree = this.router.createUrlTree([path], { queryParams: this.trackingQueryParams });
    const url = this.serializer.serialize(tree);

    this.window.open(url, '_blank');
  }
}

