import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';

const PROPERTY_DETAIL_ASSETS_URL: string = 'assets/images/property_view_imgs';

type PropertyViewMode = 'dynamic' | 'static';

@Component({
  selector: 'app-property-detail-images',
  templateUrl: './property-detail-images.component.html',
  styleUrls: [
    './property-detail-images.component.css',
  ],
})
export class PropertyDetailImagesComponent {
  @Input() marker: ExtendedMarkerModel;
  @Input() offerPrice: number;

  @Output() toggleSlideshow: EventEmitter<void> = new EventEmitter<void>();

  public name: string = 'property-detail-images';

  isSmallMobileDevice$ = isSmallMobileDevice$;

  private propertyView: PropertyViewMode = 'static';

  public get backgroundImage(): string {
    if (!this.marker.hasImages) {
      const image = this.marker.isPropertyOfTypeMFH ? 'MFH.jpg' : 'SFH.jpg';
      return this.getBackgroundPlaceholderUrl(image);
    }

    return this.marker.firstImage;
  }

  public get useResponsiveImage(): boolean {
    return this.marker.hasImages ? false : true;
  }

  public get backgroundPosition(): string {
    if (!this.marker.hasImages) {
      if (this.marker.isPropertyOfTypeMFH) {
        return '0 20%';
      } else {
        return '0 0';
      }
    }

    return 'center';
  }

  public get showExplanation(): boolean {
    if (this.marker.isPropertyOfTypeMFH && this.marker.hasApartments) {
      return false;
    }

    return !this.marker.hasImages;
  }

  public get position(): google.maps.LatLngLiteral {
    const {Latitude, Longitude} = this.marker;
    return {lat: Latitude, lng: Longitude};
  }

  public get isStaticPropertyView(): boolean {
    return this.propertyView === 'static';
  }

  public get isDynamicPropertyView(): boolean {
    return this.propertyView === 'dynamic';
  }

  public switchPropertyView(mode: PropertyViewMode): void {
    this.propertyView = mode;
  }

  public openSlideshow(): void {
    this.toggleSlideshow.emit();
  }

  private getBackgroundPlaceholderUrl(imageFile: string): string {
    return `${ PROPERTY_DETAIL_ASSETS_URL }/${ imageFile }`;
  }
}
