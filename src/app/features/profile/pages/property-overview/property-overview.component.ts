import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { Router } from '@angular/router';

import { cloneDeep } from 'lodash';

import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { PriceTrends } from '../../../../core/models/marker-price-trend.model';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { SaleStatus } from '../../../../features/profile/components/change-selling-status/change-selling-status.component';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { OfferData } from '../../../../core/models/properties-repository.model';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';
import { PropertyDetailsService } from '../../../property-detail/services/property-details.service';

@Component({
  selector: 'app-property-overview',
  templateUrl: './property-overview.component.html',
  styleUrls: ['./property-overview.component.css'],
})
export class PropertyOverviewComponent implements OnChanges {
  @Input() marker: ExtendedMarkerModel = null;

  @Output() activateTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateActiveProperty: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateDirtyProperty: EventEmitter<any> = new EventEmitter<any>();

  public _name: string = 'property-overview';

  public offers: any;

  public propertyFillLevelValue: number = 0;
  public propertyFillLevelWidth: string = null;

  public priceTrends: PriceTrends;
  public priceTrendsLoading: boolean;

  public isOffersInfoHidden: boolean = false;
  public isMortgageHidden: boolean = false;

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public dirtyMarker: ExtendedMarkerModel;
  public saleStatus: SaleStatus;

  public get userNotAuthorized() {
    return !this.authService.isUserLoggedIn();
  }

  public get showMortgageInfo(): boolean {
    return !this.isMortgageHidden;
  }

  private async getPropertyOffers(id: string) {
    try {
      const offersData = <OfferData>(await this.propertiesRepositoryService.getOffersData(id).toPromise());
      this.offers = offersData.results || [];
    } catch (error) {
      this.logger.error('ProfilePage::_loadProfileData:Error', error);
    }
  }

  private _calcFillLevel(marker: ExtendedMarkerModel): void {
    this.propertyFillLevelValue = 0;
    this.propertyFillLevelWidth = null;
    const fields = [
      'Floor', 'Door', 'PropertySubType', 'HistoricalProperty', 'LeaseHold',
      'Rented', 'ConstructionYear', 'LastModernisationYear', 'RoomsNumber',
      'FloorNumber', 'LivingSurface', 'UsableArea', 'TotalArea', 'HeatingType',
      'EnergyCertificate', 'EnergyGrade', 'RoofCovering', 'Windows', 'Floor',
      'PropertyCondition', 'PropertySubType', 'FloorLocation', 'Title',
      'EnergyCertificateStatus', 'EnergyConsumptionClass', 'FacilitiesQuality',
      'EnergySource', 'HeatingType', 'EnergyCertificateType', 'EnergyCertificateDate',
      'EnergyCertificateValue', 'WaterHeatingIncluded', 'RealtorPercentage'
    ];

    const subFields = [
      'Cellar', 'Elevator', 'Garage', 'Parking', 'Garden', 'Kitchen', 'Terrace',
      'Balcony', 'Chimney', 'AirConditioned', 'Sauna', 'SwimmingPool', 'Furnished',
      'BarrierFree'
    ];

    fields.forEach((item) => {
      if (marker[item] != null && marker[item] !== '' && marker[item] !== 0) {
        this.propertyFillLevelValue += 5;
      }
    });

    if (subFields.some((item) => marker[item] != null && marker[item] !== '')) {
      this.propertyFillLevelValue += 5;
    }

    if (this.propertyFillLevelValue > 100) this.propertyFillLevelValue = 100;

    const extraLevelWidth = Math.floor(this.propertyFillLevelValue / 20) * 3;

    this.propertyFillLevelWidth = `calc(${this.propertyFillLevelValue}% + ${extraLevelWidth}px)`;
  }

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    private router: Router,
    private mapManager: MapManagerService,
    private authService: AuthService,
    private showSignupModalService: ShowSignupModalService,
    private propertyDetailsService: PropertyDetailsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public async getPriceTrends(): Promise<void> {
    this.priceTrendsLoading = true;
    this.priceTrends = await this.propertiesRepositoryService.getAllTrends(this.marker.id);
    this.priceTrendsLoading = false;
  }

  public async setMapState(id: string, type: string) {
    const property = await this.propertiesRepositoryService.getMarkerDetails(id);
    this.mapManager.saveMapSettings({
      zoom: 19,
      mapTypeId: 'hybrid',
      center: {
        lat: property.position.lat,
        lng: property.position.lng
      },
      activeMarkerId: id,
      activeMarkerType: type,
      needOpenDetailWindow: true,
    });
  }

  public goToMortgagePage(): void {
    this.router.navigate(['/broker'], { queryParamsHandling: 'merge' });
  }

  public _activateTab(tab: string, block: string = null): void {
    setTimeout(() => {
      this.activateTab.emit({tab, block});
    }, 300);
  }

  public openContactForm(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.authService.setContactOwnerSignupInfo(this.marker.id);
      this.showSignupModalService.showSignup();
    } else {
      this.propertyDetailsService.openContactOwnerModal();
    }
  }

  public get propertyAddress(): string {
    return this.marker.ShowAddress ?
      `${this.marker.Street} ${this.marker.HouseNumber}, ${this.marker.PostalCode} ${this.marker.Locality}` : '';
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._calcFillLevel(this.marker);
    this.getPropertyOffers(this.marker.id);
    this.getPriceTrends();
    this.configureDirtyMarker(changes);
    this.configureSaleStatus();
  }

  public onSaleStatusChange(saleStatus: SaleStatus): void {
    this.applySaleStatusToDirtyMarker(saleStatus);
    this.emitUpdateDirtyProperty();
  }

  public async onSaleStatusSave(saleStatus: SaleStatus): Promise<void> {
    this.applySaleStatusToDirtyMarker(saleStatus);
    await this.propertiesRepositoryService.updatePropertyDetail(this.dirtyMarker.id, this.dirtyMarker, true);
    this.emitUpdateActiveProperty();
  }

  private applySaleStatusToDirtyMarker(saleStatus: SaleStatus): void {
    const { sellingStatus, sellingPrice } = saleStatus;
    this.dirtyMarker.SellingStatus = sellingStatus;
    this.dirtyMarker.SalePrice = sellingPrice;
  }

  private configureDirtyMarker(changes: SimpleChanges): void {
    const changedMarker = changes.marker ? changes.marker.currentValue : null;
    this.dirtyMarker = changedMarker ? cloneDeep(changedMarker) : null;
  }

  private configureSaleStatus(): void {
    if (!this.dirtyMarker) {
      this.saleStatus = null;
      return;
    }

    const { SellingStatus, SalePrice } = this.dirtyMarker;
    this.saleStatus = {
      sellingStatus: SellingStatus,
      sellingPrice: SalePrice,
    };
  }

  public hideMortgageMessage(): void {
    this.isMortgageHidden = true;
  }

  private emitUpdateActiveProperty(): void {
    this.updateActiveProperty.emit();
  }

  private emitUpdateDirtyProperty(): void {
    this.updateDirtyProperty.emit(this.dirtyMarker);
  }
}
