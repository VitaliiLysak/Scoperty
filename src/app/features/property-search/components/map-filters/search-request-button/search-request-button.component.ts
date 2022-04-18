import { AfterViewInit, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgxModalStack } from 'ngx-multi-modal';
import { Observable } from 'rxjs';
import { filter, take, } from 'rxjs/operators';

import { SaveSearchAlertNameComponent } from '../../save-search-alert-name/save-search-alert-name.component';
import { SHARED_ROUTES_NAMES } from '../../../../../app.constants';
import { SearchAlertsScheme } from '../../../../../core/models/properties-repository.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { ShowSignupModalService } from '../../../../../core/services/show-signup-modal.service';
import { MapFilterService } from '../../../../../core/services/map-filter.service';
import { PropertiesRepositoryService } from '../../../../../core/services/properties-repository.service';
import { CommonErrorComponent } from '../../../../../shared/components/common-error/common-error.component';
import { isNullOrUndefined } from '../../../../../shared/utils/null-or-undefined.util';
import { QueryParamsService } from '../../../../../core/services/query-params.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-search-request-button',
  templateUrl: './search-request-button.component.html',
  styleUrls: ['./search-request-button.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchRequestButtonComponent implements AfterViewInit {
  @Input() showPopup: boolean;
  @Input() isSearchAlertOnMap: boolean = false;
  @Input() isInDefaultFilters = false;

  @ViewChild('popover') public searchAlertPopover: NgbPopover;

  public _name: string = 'search-request-button';

  private searchAlertData: SearchAlertsScheme = {};

  private userLoggedIn$: Observable<boolean> = this.authService.loggedIn$.pipe(
    filter(loggedIn => loggedIn === true),
  );

  public get contentText(): string {
    return this.isSearchAlertOnMap ? 'Suchauftrag' : 'Suchauftrag anlegen';
  }

  constructor(
    private authService: AuthService,
    private mapFilterService: MapFilterService,
    private showSignupModalService: ShowSignupModalService,
    private router: Router,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private queryParamsService: QueryParamsService,
    private modalService: NgxModalStack,
  ) {
  }

  ngAfterViewInit(): void {
    this.checkParamsForSearchAlertPopup();
    this.checkParamsForSearchAlertModal();
  }

  public async openSearchAlertModal(): Promise<void> {
    if (!this.authService.isUserLoggedIn()) {
      await this.openSaveSearchAlertNameModal();

      this.authService.setCreateSearchAlertsSignupInfo(this.searchAlertData);
      this.showSignupModalService.showSignup();
      this.userLoggedIn$.pipe(take(1))
        .subscribe(() => {
          this.saveSearchAlertName();
        });

      return;
    }

    this.saveSearchAlert();
  }

  public async saveSearchAlert(): Promise<void> {
    if (isNullOrUndefined(this.searchAlertData)) {
      return;
    }

    await this.openSaveSearchAlertNameModal();
    if (!isNullOrUndefined(this.searchAlertData) && !_.isEmpty(this.searchAlertData)) {
      await this.saveSearchAlertName();
    }
  }

  private async openSaveSearchAlertNameModal(): Promise<void> {
    if (isNullOrUndefined(this.searchAlertData)) {
      return;
    }

    // INFO: Using "ngx-multi-modal" class together with the custom one,
    // so the styles of ngx-multi-modal are also applied to the dialog.
    const modalRef = this.modalService.openFromComponent(
      SaveSearchAlertNameComponent, {
        windowClass: 'ngx-multi-modal search-alert-dialog'
      }
    );

    try {
      const searchAlertResult: SearchAlertsScheme = await modalRef.result;
      if (isNullOrUndefined(searchAlertResult)) {
        return;
      }

      this.searchAlertData = searchAlertResult;
    } catch (e) {}
  }

  private async saveSearchAlertName(): Promise<void> {
    try {
      await this.propertiesRepositoryService.createSearchAlerts(this.searchAlertData);
      this.navigateToSearchAlertsPage();
    } catch (error) {
      this.showCommonErrorModal();
    }
  }

  private navigateToSearchAlertsPage(): void {
    this.router.navigate(
      [ `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.SEARCH }` ],
      { queryParamsHandling: 'merge' }
    );
  }

  private showCommonErrorModal(): void {
    this.modalService.openFromComponent(CommonErrorComponent);
  }

  public checkParamsForSearchAlertPopup(): void {
    this.queryParamsService.showSearchAlertPopup$
      .subscribe((showSearchAlertPopup: boolean) => {
        if (showSearchAlertPopup && !this.authService.isUserLoggedIn()) {
          this.openSearchAlertPopup();
        }
      });
  }

  public checkParamsForSearchAlertModal(): void {
    if (this.isInDefaultFilters && this.queryParamsService.hasOpenSearchAlertModal()) {
      this.openSearchAlertModal();
      this.queryParamsService.clearOpenSearchAlertModal();
    }
  }

  public openSearchAlertPopup(): void {
    if (this.isSearchAlertOnMap) {
      this.searchAlertPopover.placement = 'bottom';
    }

    if (this.showPopup) {
      this.searchAlertPopover.open();
    }
  }
}
