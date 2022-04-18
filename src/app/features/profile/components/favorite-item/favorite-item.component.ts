import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { FavoriteModel } from '../../../../core/models/favorite-estate.model';
import { WINDOW } from '../../../../core/services/window.provider';
import { FeatureToggleService } from '../../../../core/services/feature-toggle/feature-toggle.service';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { MapSettings } from '../../../../core/models/map-settings.model';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';

@Component({
  selector: 'app-favorite-item',
  templateUrl: './favorite-item.component.html',
  styleUrls: ['./favorite-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteItemComponent implements OnInit {
  @Input() favorite: FavoriteModel = null;

  @Output() updateOfferPrice: EventEmitter<string> = new EventEmitter<string>();

  name: string = 'favorite-item';

  isSmallMobileDevice$ = isSmallMobileDevice$;
  linkToBroker: string[] = [ `/${ SHARED_ROUTES_NAMES.BROKER }` ];

  private format: string;
  private prefix: string;

  get image(): string {
    if (!this.favorite.hasImage) {
      return `assets/images/property_view_imgs/${ this.prefix }.${ this.format }`;
    }

    return this.favorite.imageLink;
  }

  get isForSaleOrMakeMeMove(): boolean {
    return this.favorite.isForSale || this.favorite.isMakeMeMove;
  }

  constructor(
    private router: Router,
    private mapManager: MapManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    public featureToggleService: FeatureToggleService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.configureImageDisplayConditions();
  }

  async goToProperty(): Promise<void> {
    if (this.favorite.showAddress) {
      this.goToPropertyOnMap();
    } else {
      this.goToPropertyDetails();
    }
  }

  goToPropertyDetails(): void {
    const { uuid } = this.favorite;
    const propertyDetailsUrl = [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, uuid ];
    this.router.navigate(propertyDetailsUrl, { queryParamsHandling: 'merge' });
  }

  changeOfferPrice(): void {
    this.updateOfferPrice.emit(this.favorite.uuid);
  }

  private async goToPropertyOnMap(): Promise<void> {
    const { uuid, propertyType } = this.favorite;
    await this.setMapState(uuid, propertyType);

    const mapUrl = [ `/${ SHARED_ROUTES_NAMES.MAP }` ];
    this.router.navigate(mapUrl, { queryParamsHandling: 'merge' });
  }

  private async setMapState(id: string, type: string): Promise<void> {
    const property: ExtendedMarkerModel = await this.propertiesRepository.getMarkerDetails(id);
    const settings: MapSettings = {
      zoom: 19,
      mapTypeId: 'hybrid',
      center: {
        lat: property.position.lat,
        lng: property.position.lng
      },
      activeMarkerId: id,
      activeMarkerType: type,
      needOpenDetailWindow: true,
    };

    this.mapManager.saveMapSettings(settings);
  }

  private configureImageDisplayConditions(): void {
    this.format = this.window['_canIUseWebP'] ? 'webp' : 'jpg';
    this.prefix = this.favorite.isPropertyOfTypeEFH ? 'SFH' : 'MFH';
  }
}
