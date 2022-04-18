import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Observable, Subscription, } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgxModalStack } from 'ngx-multi-modal';

import { PropertyActivateTabResult } from '../../components/property/property.component';
import { AskForSellingStatusService } from '../../services/ask-for-selling-status.service';
import { MyPropertiesService, MyPropertiesTabs, } from '../../services/my-properties.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import {
  InformationModalComponent,
  InformationModel
} from '../../../../shared/components/information-modal/information-modal.component';
import { ComponentCanDeactivate } from '../../../../core/guards/can-deactivate.guard';
import { isMediumDevice, isMediumDevice$, isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { WINDOW } from '../../../../core/services/window.provider';
import { isEmptyArray } from '../../../../shared/utils/empty-array.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { PROFILE_ROUTE_PARAMS } from '../../profile-routing.module';
import { PropertyEditComponent } from '../property-edit/property-edit.component';

const SHOW_ALERT_DELAY: number = 10;

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  @ViewChild(PropertyEditComponent) propertyEditComponent: PropertyEditComponent;

  readonly MyPropertiesTabs = MyPropertiesTabs;

  name: string = 'my-properties';

  activeBlock: string = '';
  activeProperty: ExtendedMarkerModel = null;
  dirtyMarker: ExtendedMarkerModel = null;
  certificate: File;

  myObjects: ExtendedMarkerModel[];

  isLoaded: boolean = false;
  isError: boolean = false;
  isPropertiesScrollContainerHidden: boolean = false;
  isSmallMobileDevice$ = isSmallMobileDevice$;
  isMediumDevice$ = isMediumDevice$;

  showSaveSuccess: boolean = false;
  showSaveError: boolean = false;

  private isControlsInvalid: boolean = false;
  private subscriptions: Subscription = new Subscription();

  get rights(): string {
    let rightsResult = null;

    if (this.dirtyMarker.hasOwner && this.dirtyMarker.hasRealtor) {
      rightsResult = 'owner_realtor';
    } else if (this.dirtyMarker.hasOwner && !this.dirtyMarker.hasRealtor) {
      rightsResult = 'owner';
    } else if (!this.dirtyMarker.hasOwner && this.dirtyMarker.hasRealtor) {
      rightsResult = 'realtor';
    }

    return rightsResult;
  }

  get activeSection$(): Observable<MyPropertiesTabs> {
    return this.myPropertiesService.activeTab$;
  }

  get isOverview$(): Observable<boolean> {
    return this.myPropertiesService.isOverview$;
  }

  get isEdit$(): Observable<boolean> {
    return this.myPropertiesService.isEdit$;
  }

  get isSettings$(): Observable<boolean> {
    return this.myPropertiesService.isSettings$;
  }

  private get activePropertyId(): string {
    return this.myPropertiesService.activePropertyId;
  }

  private get isDirtyMarkerUpdated(): boolean {
    if (!isNullOrUndefined(this.certificate)) {
      return true;
    }
    if (isNullOrUndefined(this.dirtyMarker)) {
      return false;
    }
    return !this.dirtyMarker.isEqual(this.activeProperty);
  }

  private async loadProfileData(): Promise<void> {
    try {
      this.myObjects = await this.propertiesRepositoryService.getProfileData();
      const activePropertyId = this.myPropertiesService.activePropertyId;
      if (isNullOrUndefined(activePropertyId) && !isEmptyArray(this.myObjects)) {
        await this.setActiveObject(this.myObjects);
      }
      this.isLoaded = true;
    } catch (error) {
      this.logger.error('ProfilePage::loadProfileData:Error', error);
      this.isLoaded = true;
      this.isError = true;
    }
  }

  private async setActiveObject(properties: ExtendedMarkerModel[]): Promise<void> {
    if (isMediumDevice() && properties.length > 1) {
      this.myPropertiesService.clearActivePropertyId();
      return;
    }

    if (!isMediumDevice()) {
      this.toggleNavbar(true);
    }
    const propertyId = properties[0].PropertyId;
    this.activateProperty(propertyId);
  }

  private toggleNavbar(isShown: boolean): void {
    this.stateManagerService.isDashboardNavbarShown = isShown;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private askForSellingStatusService: AskForSellingStatusService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private stateManagerService: StateManagerService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgxModalStack,
    private myPropertiesService: MyPropertiesService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.handleActivePropertyIdChanges();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.activatedRoute.params
      .pipe(
        switchMap(routeParams => {
        const propertyId = routeParams[PROFILE_ROUTE_PARAMS.PROPERTY_ID];

        if (!isNullOrUndefined(propertyId)) {
          this.myPropertiesService.setActivePropertyId(propertyId);
        }

        return this.myPropertiesService.activeTabQueryParam$;
      }))
      .subscribe(activeTab => {
        this.myPropertiesService.setActiveTab(activeTab);
      })
    );

    this.configureView();
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    this.toggleNavbar(true);
    this.subscriptions.unsubscribe();
  }

  onCertificateChange(file: File): void {
    this.certificate = file;
  }

  isActiveProperty(propertyId: string): boolean {
    return this.activePropertyId === propertyId;
  }

  async activateTab({ tab, update, block }: PropertyActivateTabResult): Promise<void>  {
    if (update) {
      await this.loadProfileData();
    }
    this.activateSection(tab, block);
  }

  backToPropertiesList(): void {
    if (this.isDirtyMarkerUpdated) {
      this.initInformationModal().then( (message) => {
        if (message) {
          return;
        }
        this.showPropertiesList();
      });
    } else {
      this.showPropertiesList();
    }
  }

  showPropertiesList(): void {
    this.isPropertiesScrollContainerHidden = false;
    this.activeProperty = null;
    this.dirtyMarker = null;
    this.myPropertiesService.clearActivePropertyId();
    if (!isMediumDevice()) {
      this.toggleNavbar(true);
    }

    // for tabs redrawing
    setTimeout(() => this.changeDetectorRef.detectChanges(), 300);
  }

  activateSection(section: string, block?: string): void {
    if (this.isDirtyMarkerUpdated) {
      this.initInformationModal().then(message => {
        if (message) {
          return;
        }
        this.showSection(section as MyPropertiesTabs, block);
      });
    } else {
      this.showSection(section as MyPropertiesTabs, block);
    }
  }

  private showSection(section: MyPropertiesTabs, block?: string): void {
    if (block) {
      this.activeBlock = block;
      setTimeout( () => {
        this.activeBlock = null;
      }, 500);
    }

    this.myPropertiesService.setActiveTab(section);
  }

  activateProperty(propertyId: string): void {
    if (isMediumDevice()) {
      this.isPropertiesScrollContainerHidden = true;
    }
    this.myPropertiesService.updatePropertyIdRouteParam(propertyId);
    this.myPropertiesService.setActivePropertyId(propertyId);
  }

  async updateActiveProperty(): Promise<void> {
    this.myObjects = await this.propertiesRepositoryService.getProfileData();
    this.activeProperty = await this.propertiesRepositoryService.getMarkerDetails(this.activePropertyId);
    this.dirtyMarker = cloneDeep(this.activeProperty);
  }

  async updateActivePropertyImages(): Promise<void> {
    const activeProperty = await this.propertiesRepositoryService.getMarkerDetails(this.activePropertyId);
    this.activeProperty.Images = cloneDeep(activeProperty.Images);
    this.dirtyMarker.Images = cloneDeep(activeProperty.Images);
  }

  updateDirtyProperty(dirtyMarker: ExtendedMarkerModel): void {
    this.dirtyMarker = dirtyMarker;
  }

  async initInformationModal(): Promise<boolean> {
    const params: InformationModel = {
      text: 'Du hast deine Änderungen nicht gespeichert. Willst du wirklich fortfahren ohne zu speichern?',
      buttonText: 'Änderungen speichern',
      buttonText2: 'Fortfahren',
      page: this.name,
    };
    const modalRef = this.modalService.openFromComponent(InformationModalComponent);
    Object.assign(modalRef.instance, params);
    const modalResult = await modalRef.result;
    if (modalResult) {
      await this.saveProperty();
    } else {
      this.dirtyMarker = cloneDeep(this.activeProperty);
    }
    return modalResult;
  }

  async saveProperty(): Promise<void> {
    this.saveEnergyCertificate();
    try {
      await this.propertiesRepositoryService.updatePropertyDetail(this.activePropertyId, this.dirtyMarker);
      await this.updateActiveProperty();
      this.showSuccessAlert();
    } catch (error) {
      this.showErrorAlert();
    }
  }

  saveEnergyCertificate(): void {
    if (!isNullOrUndefined(this.certificate) && !this.dirtyMarker.hasEnergyCertificateFile) {
      this.propertiesRepositoryService.updatePropertyEnergyCertificate(
        this.activePropertyId,
        this.certificate
      ).subscribe(
        () => {},
        () => this.showErrorAlert(),
      );
    }
  }

  private showSuccessAlert(): void {
    this.showSaveSuccess = true;
    setTimeout(() => {
      this.showSaveSuccess = false;
    }, 1000 * SHOW_ALERT_DELAY);
  }

  private showErrorAlert(): void {
    this.showSaveError = true;
    setTimeout(() => {
      this.showSaveError = false;
    }, 1000 * SHOW_ALERT_DELAY);
  }

  saveMarkerAndCheckSellingStatus(): void {
    this.propertyEditComponent.revalidate();
    const canSave = this.isDirtyMarkerUpdated && !this.isControlsInvalid;
    if (!canSave) {
      return;
    }

    this.askForSellingStatusService.askIfNecessary(this.dirtyMarker)
      .then(() => this.saveProperty(), () => this.saveProperty());
  }

  trackPropertyById(index: number, property: ExtendedMarkerModel): string {
    return property.id;
  }

  canDeactivate(): boolean | Observable<boolean> {
    return new Observable((observer) => {
      if (this.isDirtyMarkerUpdated) {
        this.initInformationModal().then( () => {
          return observer.next(true);
        });
      } else {
        return observer.next(true);
      }
    });
  }

  private handleActivePropertyIdChanges(): void {
    const subscription = this.myPropertiesService.activePropertyId$
      .subscribe(async (propertyId: string) => {
        if (isEmptyString(propertyId)) {
          this.activeProperty = null;
          this.dirtyMarker = null;

          return;
        }

        this.activeProperty = await this.propertiesRepositoryService.getMarkerDetails(propertyId);
        this.dirtyMarker = cloneDeep(this.activeProperty);
      });
    this.subscriptions.add(subscription);
  }

  private configureView(): void {
    if (isMediumDevice()) {
      this.toggleNavbar(false);
    }
  }
}
