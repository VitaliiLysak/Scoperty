import { Component, Inject, OnInit, } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { DialogService } from 'ng2-bootstrap-modal';

import { LANDING_PAGES, LAST_LANDING_QUERY_PARAM, SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { splitMarkersIntoGroups } from '../../../../shared/utils/markers-group-splitter';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { RegistrationComponent } from '../../../../features/registration/pages/registration/registration.component';
import { AuthService, ConfigureType } from '../../../../core/services/auth.service';
import { OpenModalService } from '../../../../core/services/open-modal.service';
import { TRACKING_QUERY_PARAMS } from '../../../../shared/utils/get-tracking-query-params.util';
import { LOCATION } from '../../../../core/services/location.provider';

type Tab = 'buy' | 'sell';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  public _name: string = 'start-page';

  public markers: Array<Array<ExtendedMarkerModel>> = [];
  public isLoaded: boolean = false;
  public sliderTitle: string = 'Aktuelle Scoperty Immobilienangebote';

  public scrollBlock: HTMLElement = null;

  public get isMarkersListNotEmpty(): boolean {
    return this.markers.length > 0;
  }

  private get scrollBlockElement(): HTMLElement {
    return this.document.getElementById('scrollBlock');
  }

  private get scrollTop(): number {
    return this.scrollBlockElement.scrollTop;
  }

  private set scrollTop(value: number) {
    this.scrollBlockElement.scrollTop = value;
  }

  public get activeTab(): Tab {
    const activatedChildRoute = this.activatedRoute.children[0];
    return activatedChildRoute
      ? activatedChildRoute.snapshot.url[0].path as Tab
      : SHARED_ROUTES_NAMES.SELL as Tab;
  }

  constructor(
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCATION) private location: Location,
    @Inject(TRACKING_QUERY_PARAMS) private trackingQueryParams: Params,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private propertiesRepository: PropertiesRepositoryService,
    private authService: AuthService,
    private openModalService: OpenModalService,
    private dialogService: DialogService,
    private queryParamsService: QueryParamsService,
  ) {
    this.scrollBlock = document.getElementById('scrollBlock');
  }

  public async ngOnInit(): Promise<void> {
    await this.loadMarkersList();
    this.queryParamsService.showDisagreementModal$.subscribe(isParamPresent => {
      if (isParamPresent) {
        this.openContradictionPossibility();
        this.router.navigate([], { queryParams: this.trackingQueryParams });
      }
    });
    this.setLandingQueryParam();
  }

  setLandingQueryParam(): void {
    const landing = this.location.pathname.substring(1);

    if (!LANDING_PAGES.includes(landing)) {
      return;
    }

    const queryParams = {};

    queryParams[LAST_LANDING_QUERY_PARAM] = landing;

    this.queryParamsService.changeQueryParamsViaAngularRouter(queryParams);
  }

  public activeTabChange(activeTab: string): void {
    const scrollTopSave = this.scrollTop;
    this.router.navigate([`/${activeTab}`], { queryParamsHandling: 'merge' })
      .then(() => {
        this.scrollTop = scrollTopSave;
        this.setLandingQueryParam();
      });
  }

  private openContradictionPossibility(): void {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.openModalService.open();
    this.dialogService
      .addDialog(
        RegistrationComponent,
        { mode: 'delete' },
      )
      .subscribe(() => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }

  private async loadMarkersList(): Promise<void> {
    try {
      const extendedMarkersList = await this.propertiesRepository.getDataByUrl('start-page');
      this.markers = splitMarkersIntoGroups(extendedMarkersList);
      this.isLoaded = (this.markers != null && this.markers.length > 0);
    } catch (error) {
      this.isLoaded = true;
      this.logger.error('StartPageComponent::loadMarkersData', error);
    }
  }
}
