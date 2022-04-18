import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import {
  NavigationExtras,
  Router,
} from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { PriceTrends } from '../../../../core/models/marker-price-trend.model';
import { AuthService, ConfigureType } from '../../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';
import { MyPropertiesTabs, PROFILE_MY_PROPERTIES_QUERY_PARAMS } from '../../../../features/profile/services/my-properties.service';
import { ValuateProperty } from '../../../../shared/components/valuate-property/valuate-property.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { RegistrationComponent } from '../../../registration/pages/registration/registration.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { OpenModalService } from '../../../../core/services/open-modal.service';

@Component({
  selector: 'app-market-view-property',
  templateUrl: './market-view-property.component.html',
  styleUrls: ['./market-view-property.component.css']
})
export class MarketViewPropertyComponent implements OnChanges {
  @Input() marker: ExtendedMarkerModel;
  @Input() userNotAuthorized: boolean;

  @Output() makeMeOwner: EventEmitter<ValuateProperty> = new EventEmitter<ValuateProperty>();

  _name: string = 'market-view-property';

  priceTrends: PriceTrends;
  priceTrendsLoading: boolean;

  linkToMyProperty: string = `${SHARED_ROUTES_NAMES.PROFILE}/${SHARED_ROUTES_NAMES.PROPERTY}`;

  get isUserOwnerOrRealtor(): boolean {
    return this.marker.isOwner || this.marker.isRealtor;
  }

  get showSellProperty(): boolean {
    return !this.marker.isOwner && !this.marker.isRealtor;
  }

  constructor(
    private modalService: NgxModalStack,
    private router: Router,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private showSignupModalService: ShowSignupModalService,
    private authService: AuthService,
    private dialogService: DialogService,
    private openModalService: OpenModalService,
  ) {}

  ngOnChanges(): void {
    this.getPriceTrends();
  }

  async getPriceTrends(): Promise<void> {
    this.priceTrendsLoading = true;
    this.priceTrends = await this.propertiesRepositoryService.getAllTrends(this.marker.id);
    this.priceTrendsLoading = false;
  }

  makeMePropertyOwner(result?: ValuateProperty): void {
    if (this.isUserOwnerOrRealtor) {
      const url: string[] = [ this.linkToMyProperty, this.marker.id ];
      const extras: NavigationExtras = {
        queryParamsHandling: 'merge',
        queryParams: {
          [ PROFILE_MY_PROPERTIES_QUERY_PARAMS.ACTIVE_TAB ]: MyPropertiesTabs.Edit,
        },
      };
      this.router.navigate(url, extras);
    } else {
      this.makeMeOwner.emit(result);
    }
  }

  showSignup(): void {
    this.authService.setOpenMarketAttractivitySignupInfo(this.marker.id);
    this.showSignupModalService.showSignup();
  }

  openPrefilledDisagreementProcess() {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.dialogService.addDialog(
      RegistrationComponent,
      { mode: 'delete', markerId: this.marker.id},
    )
      .subscribe((message) => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }
}
