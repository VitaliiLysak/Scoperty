import { Component, OnDestroy, OnInit, } from '@angular/core';

import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs';
import { NgxModalStack } from 'ngx-multi-modal';

import { OpenModalService } from '../../../core/services/open-modal.service';
import { StateManagerService } from '../../../core/services/state-manager.service';
import { AuthService, ConfigureType } from '../../../core/services/auth.service';
import { RegistrationComponent } from '../../../features/registration/pages/registration/registration.component';
import { SignupMobileMenuComponent } from '../../../features/registration/components/signup-mobile-menu/signup-mobile-menu.component';
import { isMobileDevice, isSmallMobileDevice$ } from '../../../shared/utils/responsive.util';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { ShowSignupModalService } from '../../services/show-signup-modal.service';


@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.css']
})

export class LayoutFooterComponent implements OnInit, OnDestroy {
  name: string = 'footer';

  linkToProfessionals: string = SHARED_ROUTES_NAMES.PROFESSIONALS;
  linkToImpressum: string = SHARED_ROUTES_NAMES.IMPRESSUM;
  linkToTermsOfService: string = SHARED_ROUTES_NAMES.TERMS_OF_SERVICE;
  linkToAbout: string = SHARED_ROUTES_NAMES.ABOUT;
  linkToHowItWorks: string = SHARED_ROUTES_NAMES.HOWITWORKS;
  linkToBroker: string = SHARED_ROUTES_NAMES.BROKER;
  linkToSearchBroker: string = SHARED_ROUTES_NAMES.SEARCHBROKER;
  linkToDataProtection: string = SHARED_ROUTES_NAMES.DATAPROTECTION;
  isSmallMobileDevice$ = isSmallMobileDevice$;
  isUserNotAuthorized: boolean = true;

  userTargetTabs: any = {
    services: false,
    support: false,
    unternehmen: false
  };

  private authSubscription: Subscription = null;

  get isMapPage(): boolean {
    return this.stateManagerService.isMapPage;
  }

  constructor(
    private openModalService: OpenModalService,
    private dialogService: DialogService,
    private stateManagerService: StateManagerService,
    private showSignupModalService: ShowSignupModalService,
    private authService: AuthService,
    private modalService: NgxModalStack,
    public  featureToggleService: FeatureToggleService,
  ) {}

  ngOnInit(): void {
    this.isUserNotAuthorized = !this.authService.isUserLoggedIn();
    this.authSubscription = this.authService.events.subscribe(() => {
      this.isUserNotAuthorized = !this.authService.isUserLoggedIn();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  toggleTab(tabName: string): void {
    this.userTargetTabs[tabName] = !this.userTargetTabs[tabName];
  }

  openSignupModal(): void {
    if (isMobileDevice()) {
      this.modalService.openFromComponent(SignupMobileMenuComponent);
    } else {
      this.authService.setFormSubmissionFromNavigation();
      this.showSignupModalService.openSignUpModal();
    }
  }

  openContradictionPossibility(): void {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.openModalService.open();
    this.dialogService.addDialog(
      RegistrationComponent,
      { mode: 'delete' },
    )
      .subscribe((message) => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }
}
