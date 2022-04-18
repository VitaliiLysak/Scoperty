import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { MarkerModel } from '../../../../core/models/marker.model';
import { FragmentModel } from '../../../../core/models/fragment.model';
import { isSmallDevice$, isSmallMobileDevice, windowHeight } from '../../../../shared/utils/responsive.util';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { ScopertyPlusAdService } from '../../../../core/services/scoperty-plus-ad.service';

@Component({
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.css'],
})
export class PropertySearchComponent implements OnInit, OnDestroy {
  private zoomOutForResultsSubscription: Subscription = null;

  public _name: string = 'main';

  activeMarker: FragmentModel | MarkerModel;

  // Flags
  public isSidebarShown: boolean;
  public showLoader: boolean = false;
  public disableAutofocus: boolean = false;
  public isSmallDevice$ = isSmallDevice$;

  public mapHeight: string = '';

  // Subscriptions
  public autofocusChanger: Subscription;

  private activateLoader(state: boolean): void {
    this.showLoader = state;
    this.changeDetectorRef.detectChanges();
  }

  constructor(
    private authService: AuthService,
    private mapManagerService: MapManagerService,
    private mapFilterService: MapFilterService,
    private changeDetectorRef: ChangeDetectorRef,
    private queryParamsService: QueryParamsService,
    private scopertyPlusAdService: ScopertyPlusAdService,
    private zone: NgZone,
    private router: Router,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public ngOnInit(): void {
    if (this.authService.signupState) this.disableAutofocus = true;
    else this.disableAutofocus = false;

    this.initSubscriptions();
    this.calculateMapHeight();

    this.zoomOutForResultsSubscription = this.mapFilterService.zoomOutForResults$.subscribe(this.activateLoader.bind(this));

    window.addEventListener('resize', () => {
      this.calculateMapHeight();
    });
    window.addEventListener('rotate', () => {
      this.calculateMapHeight();
    });
    this.openScopertyPlusOnboard();
  }

  public ngOnDestroy(): void {
    this.autofocusChanger.unsubscribe();
    this.deleteSearchAlertPopupQueryParams();

    if (this.zoomOutForResultsSubscription) this.zoomOutForResultsSubscription.unsubscribe();
  }

  onMarkerActivate(marker: MarkerModel | FragmentModel): void {
    this.activeMarker = marker;
  }

  public setStateSidebar(isShown: boolean): void {
    this.isSidebarShown = isShown;
  }

  public calculateMapHeight(): void {
    this.zone.run(() => {
      if (isSmallMobileDevice()) {
        this.mapHeight = `${windowHeight.value - 48}px`;
      } else {
        this.mapHeight = `${windowHeight.value - 16}px`;
      }
    });
  }

  public initSubscriptions(): void {
    this.autofocusChanger = this.mapManagerService.searchbarAutofocusChanger$
      .subscribe((newState) => this.disableAutofocus = !newState);
  }

  public deleteSearchAlertPopupQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        search_alert_popup: null
      },
      queryParamsHandling: 'merge'
    });
  }

  openScopertyPlusOnboard(): void {
    if (this.queryParamsService.hasOpenScopertyPlusOnboard() === 'true') {
      this.scopertyPlusAdService.openScopertyOnBoard();
    }
  }
}
