import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { FeatureToggleService } from '../../../../core/services/feature-toggle/feature-toggle.service';
import { ActionWithOfferPrice } from '../../../../shared/components/marker-detail-make-me-move/marker-detail-make-me-move.component';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { getEstimatedPriceText, getSalePriceText, } from '../../../../shared/utils/price-title.util';
import { isMobileDevice, isMobileDevice$ } from '../../../../shared/utils/responsive.util';

export interface PropertyDetailModalAction {
  type: string;
  title: string;
  buttonText: string;
}

@Component({
  selector: 'app-property-detail-info',
  templateUrl: './property-detail-info.component.html',
  styleUrls: [
    './property-detail-info.component.css',
  ],
})
export class PropertyDetailInfoComponent {
  @Input() marker: ExtendedMarkerModel;
  @Input() offerPrice: number;

  @Output() toggleMakeMeMoveModal: EventEmitter<ActionWithOfferPrice> = new EventEmitter<ActionWithOfferPrice>();
  @Output() toggleContactMeForm: EventEmitter<PropertyDetailModalAction> = new EventEmitter<PropertyDetailModalAction>();

  public name: string = 'property-detail-info';

  public tooltipTextFirst = `
    Der Schätzwert basiert auf mehreren Variablen und wird von Scoperty mit einem speziellen Algorithmus berechnet.
  `;
  public tooltipTextSecond = 'Hier kannst du dem Eigentümer ein unverbindliches Angebot für seine Immobilie machen.';

  isMobileDevice$ = isMobileDevice$;

  public get hasOfferPrice(): boolean {
    if (isNullOrUndefined(this.offerPrice) || this.offerPrice < 1) {
      return false;
    }

    return true;
  }

  public get favouriteSize(): string {
    return isMobileDevice() ? 'small' : 'large';
  }

  public get markerTitle(): string {
    return this.marker.hasTitle ? this.marker.Title : this.marker.fullAddress;
  }

  public get priceTitle(): string {
    return this.marker.isStatusForSale
      ? getSalePriceText(this.marker.PropertyType).toUpperCase()
      : getEstimatedPriceText(this.marker.PropertyType).toUpperCase();
  }

  public get estimatedPriceTitle(): string {
    return getEstimatedPriceText(this.marker.PropertyType);
  }

  public get headerQuestion(): string {
    if (this.marker.isPropertyOfTypeEFH) {
      return 'GEFÄLLT DIR DAS HAUS?';
    } else if (this.marker.isPropertyOfTypeMFH) {
      return 'INTERRESSIERST DU DICH FÜR EINE DER WOHNUNGEN?';
    } else {
      return 'GEFÄLLT DIR DIE IMMOBILIE?';
    }
  }

  public get markerPrice(): number {
    if (this.marker.isStatusForSale && this.marker.SalePrice) {
      return this.marker.SalePrice;
    } else {
      return this.marker.EstimatedPrice;
    }
  }

  constructor(public featureToggleService: FeatureToggleService) {
  }

  public openMakeMeMoveModal(action: ActionWithOfferPrice): void {
    this.toggleMakeMeMoveModal.emit(action);
  }

  public openContactMeForm(): void {
    this.toggleContactMeForm.emit();
  }
}
