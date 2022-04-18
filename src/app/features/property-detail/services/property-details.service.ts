import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { AuthenticationComponent } from '../../authentication/components/authentication/authentication.component';
import {
  AuthenticationModel,
  AuthenticationUserInfoModel,
} from '../../authentication/components/authentication/authentication.model';
import { AuthenticationUserInfoModelSerializer } from '../../authentication/components/authentication/authentication.serializer';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { UserObjectAttributes } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { StateManagerService } from '../../../core/services/state-manager.service';
import { isEmptyString } from '../../../shared/utils/empty-string.util';
import {
  MarkerDetailContactMeWindowComponent,
  ContactMeModel,
} from '../../../shared/components/marker-detail-contact-me-window/marker-detail-contact-me-window.component';

export type PropertyDetailsTab = 'overview' | 'marketView';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailsService {
  private propertyId: string;

  private activeTabSubject: BehaviorSubject<PropertyDetailsTab> = new BehaviorSubject<PropertyDetailsTab>('overview');
  readonly activeTab$: Observable<PropertyDetailsTab> = this.activeTabSubject.asObservable();

  private propertySubject: ReplaySubject<ExtendedMarkerModel> = new ReplaySubject<ExtendedMarkerModel>(1);
  readonly property$: Observable<ExtendedMarkerModel> = this.propertySubject.asObservable();

  private updatePropertySubject: Subject<void> = new Subject<void>();
  private updateProperty$: Observable<void> = this.updatePropertySubject.asObservable();

  readonly isOverview$: Observable<boolean> = this.activeTab$.pipe(
    map((tab: PropertyDetailsTab) => tab === 'overview'),
  );
  readonly isMarketView$: Observable<boolean> = this.activeTab$.pipe(
    map((tab: PropertyDetailsTab) => tab === 'marketView'),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgxModalStack,
    private authService: AuthService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private stateManagerService: StateManagerService,
  ) {
    this.handlePropertyUpdates();
  }

  async getPropertyInfo(propertyId: string): Promise<void> {
    const property = !isEmptyString(propertyId)
      ? await this.propertiesRepositoryService.getMarkerDetails(propertyId)
      : this.stateManagerService.activeMarker;

    this.propertyId = propertyId;
    this.propertySubject.next(property);
  }

  openMakeMeOwnerModal(livingArea: string, constructionYear: string): void {
    this.property$.pipe(take(1))
      .subscribe(async (property: ExtendedMarkerModel) => {
        const userInfo = await this.getUserInfo();
        const analyticsFormContext = 'property-details-claim-property';
        const dialogModel: AuthenticationModel = {
          userInfo,
          property,
          correctedLivingArea: livingArea,
          correctedConstructionYear: constructionYear,
          analyticsFormContext,
        };
        const modalRef = this.modalService.openFromComponent(AuthenticationComponent);
        Object.assign(modalRef.instance, dialogModel);
        modalRef.instance.propertyChange.subscribe(() => {
          this.updatePropertySubject.next();
        });
      });
  }

  openAddApartmentModal(floor: string, livingArea: string): void {
    this.property$.pipe(take(1))
      .subscribe(async (property: ExtendedMarkerModel) => {
        const userInfo = await this.getUserInfo();
        const analyticsFormContext = 'property-details-claim-apartment';
        const dialogModel: AuthenticationModel = {
          userInfo,
          property,
          apartmentFloor: floor,
          apartmentLivingArea: livingArea,
          analyticsFormContext,
        };
        const modalRef = this.modalService.openFromComponent(AuthenticationComponent);
        Object.assign(modalRef.instance, dialogModel);
        modalRef.instance.propertyChange.subscribe(() => {
          this.updatePropertySubject.next();
        });
      });
  }

  openContactOwnerModal(): void {
    this.property$.pipe(take(1))
      .subscribe(async (property: ExtendedMarkerModel) => {
        const dialogModel: ContactMeModel = { propertyId: property.id };
        const modalRef = this.modalService.openFromComponent(MarkerDetailContactMeWindowComponent);
        Object.assign(modalRef.instance, dialogModel);
      });
  }

  openMarketAttractivityTab(): void {
    this.setActiveTab('marketView');
  }

  setActiveTab(tab: PropertyDetailsTab): void {
    this.activeTabSubject.next(tab);
  }

  private async getUserInfo(): Promise<AuthenticationUserInfoModel> {
    const userAttributes: UserObjectAttributes = await this.authService.getUserAttributes();
    return AuthenticationUserInfoModelSerializer.from(userAttributes);
  }

  private handlePropertyUpdates(): void {
    this.updateProperty$.subscribe(() => {
      this.getPropertyInfo(this.propertyId);
    });
  }
}
