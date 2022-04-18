import {
  Component,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
  SimpleChanges,
} from '@angular/core';

import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { MarkerModel } from '../../../../core/models/marker.model';
import { FragmentModel } from '../../../../core/models/fragment.model';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { ListingSerializer } from '../../../../core/models/listing.serializer';
import { ListingDetailsDto } from '../../../../core/models/properties-repository.model';
import { MarkerModelWithoutAddress } from '../../../../core/models/marker-without-address.model';
import { MarkerWithoutAddressSerializer } from '../../../../core/models/marker-without-address.serializer';

import {
  createPropertyShortDetailOverlay,
  PropertyShortDetailOverlay
} from './property-short-detail-page-overlay.util';
import { PropertyViewComponent } from './property-view/property-view.component';
import { ScopertyPlusPropertyViewComponent } from './scoperty-plus-property-view/scoperty-plus-property-view.component';
import { SCOPERTY_PLUS_OFFSET, ScopertyPlusMarkerModel } from '../../../../core/models/scoperty-plus-marker.model';

@Component({
  selector: 'app-fancy-info-window',
  templateUrl: './fancy-info-window.component.html',
  styleUrls: ['./fancy-info-window.component.css'],
})
export class FancyInfoWindowComponent implements OnChanges, OnDestroy {
  @Input() markerId: string;
  @Input() openWithoutAddress: boolean;
  @Input() property: ExtendedMarkerModel | MarkerModel | FragmentModel | MarkerModelWithoutAddress;
  @Input() googleMap: google.maps.Map = null;
  @Input() scopertyPlusAdMarker: ScopertyPlusMarkerModel;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  groupedPropertyWithoutAddress: any = {
    propertyDetailData: []
  };
  indexPropertyPagination: number = 0;
  scrapedWithoutAddressGroupedQuantity: number = null;

  private marker: ExtendedMarkerModel;

  private overlay: google.maps.OverlayView;
  private component: ComponentRef<PropertyViewComponent | ScopertyPlusPropertyViewComponent>;

  get displaceShortDetailPage(): any {
    if (this.scopertyPlusAdMarker) {
      return { x: SCOPERTY_PLUS_OFFSET.x, y: -52 - SCOPERTY_PLUS_OFFSET.y };
    }

    if (this.openWithoutAddress) {
      if (
        !isNullOrUndefined((this.property as FragmentModel).scrapedWithoutAddressGroupedQuantity) ||
        this.groupedPropertyWithoutAddress.propertyDetailData.length > 1
      ) {
        this.scrapedWithoutAddressGroupedQuantity = (this.property as FragmentModel).scrapedWithoutAddressGroupedQuantity;
        return {x: 71, y: -10};
      } else {
        return { x: 32, y: -10 };
      }
    } else {
      return { x: 0, y: -34 };
    }
  }

  private get isNotExtendedMarkerModel(): boolean {
    return this.property instanceof MarkerModel ||
      this.property instanceof FragmentModel ||
      this.property instanceof MarkerModelWithoutAddress;
  }

  private get isExtendedMarkerModel(): boolean {
    return this.property instanceof ExtendedMarkerModel;
  }

  private get isMarkerModelWithoutAddress(): boolean {
    return this.property instanceof MarkerModelWithoutAddress;
  }

  constructor(
    private propertiesRepository: PropertiesRepositoryService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.scopertyPlusAdMarker) {
      this.rerender();
      return;
    }

    if (this.isMarkerModelWithoutAddress) {
      this.setDetailProperties();
    }

    if (changes.hasOwnProperty('markerId')) {
      const currentValue: string = changes.markerId.currentValue;

      if (isNullOrUndefined(currentValue)) {
        this.closeShortDetailPage();
      } else if (changes.markerId.previousValue !== currentValue) {
        if (this.isNotExtendedMarkerModel && this.property.isScraped) {
          if (this.openWithoutAddress) {
            this.fetchListingDetails();
          } else {
            this.marker = new ExtendedMarkerModel();
            this.fetchListingDetails();
          }
        } else {
          if (this.openWithoutAddress) {
            await this.fetchMarkerDetails();
          } else {
            this.marker = new ExtendedMarkerModel();
            await this.fetchMarkerDetails();
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.closeShortDetailPage();
  }

  setDetailProperties(index: number = 0): Promise<void> {
    if (this.scopertyPlusAdMarker) {
      this.rerender();
      return;
    }

    if (this.isNotExtendedMarkerModel) {
      this.indexPropertyPagination = index;
    }

    if (this.isExtendedMarkerModel) {
      this.property = this.groupedPropertyWithoutAddress;
    }

    if (this.property instanceof FragmentModel) {
      this.property = new MarkerModelWithoutAddress(this.property.markerWithoutAddress);
    }

    this.groupedPropertyWithoutAddress = (this.property as MarkerModelWithoutAddress);
    this.property = MarkerWithoutAddressSerializer.createExtendedMarkerFromMarkerWithoutAddress(
      (this.property as MarkerModelWithoutAddress).propertyDetailData[index],
      (this.property as MarkerModelWithoutAddress)
    );
  }

  private markersDetailsChanged(marker: ExtendedMarkerModel): void {
    if (this.scopertyPlusAdMarker) {
      this.rerender();
      return;
    }
    this.marker = marker;

    if (this.property instanceof MarkerModel) {
      if (
        isNullOrUndefined(this.marker.Latitude) && isNullOrUndefined(this.marker.Longitude) ||
        this.marker.Latitude === 0 && this.marker.Longitude === 0
      ) {
        this.marker.Latitude = this.property.Latitude;
        this.marker.Longitude = this.property.Longitude;
      }

      if (isNullOrUndefined(this.marker.Street)) {
        this.marker.Street = this.property.Street;
      }

      if (isNullOrUndefined(this.marker.HouseNumber)) {
        this.marker.HouseNumber = this.property.HouseNumber;
      }

      if (isNullOrUndefined(this.marker.PostalCode)) {
        this.marker.PostalCode = this.property.PostalCode;
      }

      if (isNullOrUndefined(this.marker.Locality)) {
        this.marker.Locality = this.property.Locality;
      }
    }

    this.rerender();
    this.updateComponentData();
  }

  private async fetchMarkerDetails(): Promise<void> {
    if (this.scopertyPlusAdMarker) {
      return;
    }

    let marker;

    if (!isNullOrUndefined(this.property) && this.isExtendedMarkerModel) {
      marker = this.property;
    } else if (isNullOrUndefined(this.property) || this.isNotExtendedMarkerModel) {
      marker = await this.propertiesRepository.getMarkerDetails(this.markerId);
    } else {
      marker = this.property;
    }

    if (!isNullOrUndefined(marker) && !marker.isStatusIdle) {
      this.markersDetailsChanged(marker);
    }
  }

  private fetchListingDetails(): void {
    if (this.scopertyPlusAdMarker) {
      return;
    }

    this.propertiesRepository.getListingDetails(this.property.id)
      .subscribe(async (listingDetails: ListingDetailsDto) => {
        let marker;
        if (this.openWithoutAddress) {
          if (this.property instanceof FragmentModel) {
            marker = MarkerWithoutAddressSerializer.createExtendedMarkerFromMarkerWithoutAddress(
              (this.property as FragmentModel).markerWithoutAddress.propertyDetailData[0],
              (this.property as FragmentModel).markerWithoutAddress
            );
          } else {
            marker = this.property;
          }
        } else {
          marker = ListingSerializer.createMarkerFromListingDetails(this.marker, this.property, listingDetails);
        }

        if (!isNullOrUndefined(marker.matchedProperty)) {
          const matchedMarker = await this.propertiesRepository.getMarkerDetails(marker.matchedProperty);
          marker.EstimatedPrice = matchedMarker.EstimatedPrice;
        }

        this.markersDetailsChanged(marker);
      });
  }

  private rerender(): void {
    if (isNullOrUndefined(this.component) && isNullOrUndefined(this.overlay)) {
      this.createPropertyViewComponent();
      this.createOverlay();
    } else {
      this.updateOverlayPosition();
    }

    if (this.scopertyPlusAdMarker) {
      this.component.changeDetectorRef.detectChanges();
    }
  }

  private updateComponentData(): void {
    this.component.instance.marker = this.marker;
    this.component.instance.propertyDetailData = this.groupedPropertyWithoutAddress.propertyDetailData;
    this.component.instance.openWithoutAddress = this.openWithoutAddress;
    this.component.instance.indexPropertyPagination = this.indexPropertyPagination;
    this.component.instance.scrapedWithoutAddressGroupedQuantity = this.openWithoutAddress === true
      ? this.scrapedWithoutAddressGroupedQuantity
      : null;
    this.component.changeDetectorRef.detectChanges();
  }

  private updateOverlayPosition(): void {
    const offset = this.displaceShortDetailPage;
    (this.overlay as PropertyShortDetailOverlay).updatePosition(
      this.scopertyPlusAdMarker ?
        this.scopertyPlusAdMarker.markerPosition :
        new google.maps.LatLng(this.marker.Latitude, this.marker.Longitude),
      offset
    );
  }

  private createOverlay(): void {
    const latlng = this.scopertyPlusAdMarker
      ? this.scopertyPlusAdMarker.markerPosition
      : new google.maps.LatLng(this.marker.Latitude, this.marker.Longitude);
    this.overlay = createPropertyShortDetailOverlay({
      detectChanges: () => {
        if (this.component && !this.component.changeDetectorRef['destroyed']) {
          this.component.changeDetectorRef.detectChanges();
        }
      },
      map: this.googleMap,
      htmlElement: this.component.location.nativeElement,
      latlng,
      offset: this.displaceShortDetailPage,
    });
  }

  private createPropertyViewComponent(): void {
    if (this.scopertyPlusAdMarker) {
      this.component = this.resolver
        .resolveComponentFactory(ScopertyPlusPropertyViewComponent)
        .create(this.injector);
    } else {
      this.component = this.resolver
        .resolveComponentFactory(PropertyViewComponent)
        .create(this.injector);
    }

    this.component.instance.close.subscribe(this.closeShortDetailPage.bind(this));

    if (this.marker) {
      this.updateComponentData();

      this.component.instance.changeProperty.subscribe((index) => {
        this.setDetailProperties(index);
        this.fetchMarkerDetails();
      });
    }
  }

  private closeShortDetailPage(): void {
    this.destroyOverlay();
    this.destroyPropertyViewComponent();
    setTimeout(() => this.close.emit());
  }

  private destroyOverlay(): void {
    if (!isNullOrUndefined(this.overlay)) {
      this.overlay.setMap(null);
      this.overlay = null;
    }
  }

  private destroyPropertyViewComponent(): void {
    if (!isNullOrUndefined(this.component)) {
      this.component.destroy();
      this.component = null;
    }
  }
}
