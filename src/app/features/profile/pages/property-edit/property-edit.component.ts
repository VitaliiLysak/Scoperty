import { Component, EventEmitter, Inject, Input, OnChanges, Output, ViewChild, } from '@angular/core';

import { cloneDeep } from 'lodash';
import { NgxModalStack } from 'ngx-multi-modal';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { AskForSellingStatusService } from '../../services/ask-for-selling-status.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { PropertyStatus } from '../../../../core/models/properties-repository.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import {
  InformationModalComponent,
  InformationModel,
} from '../../../../shared/components/information-modal/information-modal.component';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { FeatureToggleService } from '../../../../core/services/feature-toggle/feature-toggle.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MarkerDetailDataComponent } from '../../../../shared/components/marker-detail-data/marker-detail-data.component';
import { IImage } from '../../../../core/models/image.model';

interface EventChangeProperty {
  key: string;
  value: string | boolean;
}

@Component({
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html',
  styleUrls: ['./property-edit.component.css']
})
export class PropertyEditComponent implements OnChanges {
  @ViewChild(MarkerDetailDataComponent) markerDetailDataComponent: MarkerDetailDataComponent;
  @Input() marker: ExtendedMarkerModel = null;
  @Input() block: any = null;
  @Input() rights: string;
  @Input() propertyPrice: number;

  @Output() certificateChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() updateActiveProperty: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateActivePropertyImages: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateDirtyProperty: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeFeedbackSavingDisplay: EventEmitter<any> = new EventEmitter<any>();

  private changes: Map<string, any> =  new Map<string, any>();

  dirtyMarker: ExtendedMarkerModel = null;
  markerIsDirty: boolean = false;

  name: string = 'property-edit';
  displayMode: string = 'edit';

  isPropertyDataShown: boolean = true;
  isPropertyCostsShown: boolean = true;
  isPropertyImagesShown: boolean = true;
  isPropertyEquipmentShown: boolean = true;
  isPropertyDescriptionShown: boolean = true;
  isPropertyEnergyShown: boolean = true;
  isPropertyContactShown: boolean = true;
  isPropertyActivateInfo: boolean = false;

  imageUploadError: string;

  tooltipContent: string = 'some text ...';

  controlsValidation: any = {};

  get hasListing(): boolean {
    return this.dirtyMarker.Listing;
  }

  get isOwnerRealtorRights(): boolean {
    return this.rights === 'owner_realtor';
  }

  constructor(
    private modalService: NgxModalStack,
    private propertiesRepository: PropertiesRepositoryService,
    private scrollToService: ScrollToService,
    private analyticsService: AnalyticsService,
    private askForSellingStatusService: AskForSellingStatusService,
    @Inject(LOGGER) private logger: LoggerService,
    public featureToggleService: FeatureToggleService,
  ) {}

  ngOnChanges(): void {
    this.changes.clear();
    this.updateIsDirty();
    this.dirtyMarker = cloneDeep(this.marker);
    if (this.block) {
      setTimeout( () => {
        this.goBlock(this.block);
      }, 300);
    }
  }

  onCertificateChange(file: File) {
    this.certificateChange.emit(file);
  }

  changeImageOrder(event: IImage) {
    this.propertiesRepository.changeImageOrder(this.marker.id, event.id, event.order);
  }

  async uploadImage(body: FormData): Promise<void> {
    this.imageUploadError = null;
    try {
      await this.propertiesRepository.uploadImage(this.dirtyMarker.id, body);
    } catch (error) {
      this.imageUploadError = 'Du hast das Limit von 12 MB pro Bild überschritten!';
      this.logger.error('PropertyEditComponent::uploadImage:', error);
    } finally {
      this.updateActivePropertyImages.emit();
    }
  }

  async removeImages(imageIds: Array<string>): Promise<void> {
    imageIds.map(async (imgId) => await this.propertiesRepository.removeImage(this.dirtyMarker.id, imgId));
    setTimeout( () => {
      this.emitUpdateActiveProperty();
    }, 100);
  }

  async propertyHide(event: boolean): Promise<void> {
    this.dirtyMarker.ShowAddress = !event;
    await this.propertiesRepository.updateShowAddressProperty(this.dirtyMarker).subscribe(
      () => this.emitUpdateActiveProperty()
    );
  }

  changeProperty(key: string, value: string | boolean): void {
    if (key === 'Nothing') {
      this.dirtyMarker.Garden = false;
      this.dirtyMarker.VisitorsWC = false;
      this.dirtyMarker.Cellar = false;
      this.dirtyMarker.Balcony = false;
      this.dirtyMarker.Kitchen = false;
      this.dirtyMarker.SecondaryEntrance = false;
      this.dirtyMarker.AirConditioned = false;
      this.dirtyMarker.Elevator = false;
      this.dirtyMarker.Chimney = false;
      this.dirtyMarker.Sauna = false;
      this.dirtyMarker.SwimmingPool = false;
      this.dirtyMarker.Furnished = false;
      this.dirtyMarker.BarrierFree = false;
    } else {
      this.dirtyMarker[key] = value;
    }
    this.updateIsDirty();
    this.emitUpdateDirtyProperty();
  }

  changePropertyFromEvent({key, value}: EventChangeProperty): void {
    this.changeProperty(key, value);
  }

  changePropertyFromEquipment(equipmentForm) {
    Object.assign(this.dirtyMarker, equipmentForm);
    this.updateIsDirty();
    this.emitUpdateDirtyProperty();
  }

  revalidate() {
    this.markerDetailDataComponent.revalidate();
  }

  inputed(key: string, invalid: boolean): void {
    this.controlsValidation[key] = invalid;
  }

  goBlock(block: string): void {
    const config: ScrollToConfigOptions = {
      target: block,
      duration: 650,
      easing: 'easeOutElastic',
      offset: 20
    };

    this.scrollToService.scrollTo(config);
  }

  toggleDataSection(section: string): void {
    switch (section) {
      case 'costsData':
        this.isPropertyCostsShown = !this.isPropertyCostsShown;
        break;
      case 'detailData':
        this.isPropertyDataShown = !this.isPropertyDataShown;
        break;
      case 'imagesData':
        this.isPropertyImagesShown = !this.isPropertyImagesShown;
        break;
      case 'equipmentData':
        this.isPropertyEquipmentShown = !this.isPropertyEquipmentShown;
        break;
      case 'descriptionData':
        this.isPropertyDescriptionShown = !this.isPropertyDescriptionShown;
        break;
      case 'energyData':
        this.isPropertyEnergyShown = !this.isPropertyEnergyShown;
        break;
      case 'contactData':
        this.isPropertyContactShown = !this.isPropertyContactShown;
        break;
    }
  }

  async switcherClick(event: MouseEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    await this.confirmPropertyChange();
  }

  async confirmPropertyChange(): Promise<void> {
    const params: InformationModel = {
      text: 'Möchtest du die Anzeige wirklich aktivieren?',
      buttonText: 'Anzeige aktivieren',
      buttonText2: 'Abbrechen',
      page: this.name,
    };

    if (this.hasListing) {
      params.text = 'Willst du die Anzeige endgültig löschen?';
      params.attention = 'Achtung, dieser Schritt kann nicht mehr rückgängig gemacht werden.';
      params.buttonText = 'Löschen';
    }

    const modalRef = this.modalService.openFromComponent(InformationModalComponent);
    Object.assign(modalRef.instance, params);
    const modalResult = await modalRef.result;

    if (modalResult) {
      this.switchListing();
      if (this.hasListing) {
        this.createListing();
      } else {
        this.deleteListing();
      }
      this.emitUpdateActiveProperty();
    }
  }

  switchListing(): void {
    this.dirtyMarker.Listing = !this.dirtyMarker.Listing;
  }

  resetDirtyMarker(): void {
    this.dirtyMarker = cloneDeep(this.marker);
  }

  deleteListing(): void {
    this.dirtyMarker.SalePrice = null;
    this.dirtyMarker.SellingStatus = PropertyStatus.Active;
    this.saveMarker();
  }

  emitUpdateActiveProperty(): void {
    this.updateActiveProperty.emit();
  }

  emitUpdateDirtyProperty(): void {
    this.analyticsService.triggerFormSubmissionSuccess('editPropertyForm', 'edit-property-from-profile');
    this.updateDirtyProperty.emit(this.dirtyMarker);
  }

  private updateIsDirty(): void {
    this.markerIsDirty = this.changes.size > 0;
  }

  private createListing(): void {
    this.dirtyMarker.SellingStatus = PropertyStatus.ForSale;
    this.propertiesRepository.createListing(this.dirtyMarker).subscribe(
      () => this.emitUpdateActiveProperty(),
      () => {},
      () => {
        const dialogModel: ConfirmationDialogModel = {
          message: 'Deine Anzeige ist jetzt veröffentlicht!',
          type: ConfirmationDialogType.Success,
          buttonLabel: 'Fortfahren',
        };
        const confiramtionRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
        Object.assign(confiramtionRef.instance, dialogModel);
      }
    );
  }

  private async saveMarker(): Promise<void> {
    await this.propertiesRepository.updatePropertyDetail(this.dirtyMarker.id, this.dirtyMarker);
    this.emitUpdateActiveProperty();
  }
}
