import {
  AfterContentInit,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { OverlayService } from './core/services/overlay.service';
import { StateManagerService } from './core/services/state-manager.service';
import { AuthService } from './core/services/auth.service';
import { MapFilterService } from './core/services/map-filter.service';
import { ExtendedMarkerModel } from './core/models/extended-marker.model';
import { AnalyticsService } from './core/services/analytics/analytics.service';
import { clientHeight, isSmallDevice } from './shared/utils/responsive.util';
import { FreshchatService } from './core/services/freshchat.service';
import { CookiesService } from './core/services/cookies.service';
import { QUERY_PARAMS } from './shared/utils/get-query-params.util';
import { isNullOrUndefined } from './shared/utils/null-or-undefined.util';
import { ScriptsLoaderService } from './core/services/scripts-loader.service';
import { ScopertyPlusAdService } from './core/services/scoperty-plus-ad.service';
import { LOCATION } from './core/services/location.provider';

const scrollTo = (element, top, left) => {
  if (!isNullOrUndefined(element.scrollTo)) {
    element.scrollTo(top, left);
    return;
  }
  if (!isNullOrUndefined(element.scroll)) {
    element.scroll(top, left);
    return;
  }
  element.scrollTop = top;
  element.scrollLeft = left;
};

const SCROLL_TIMEOUT = 2500; // Seconds

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('scrollContainer')
  scrollContainerElement: ElementRef;

  public _name: string = 'app';

  public isFirstFooter: boolean;
  public isInitialScreen: boolean = true;
  public overlayOn: boolean = false;
  public overlaySubscription: Subscription;

  public get cookiesState(): boolean {
    return this.cookiesService.cookiesFormIsShown;
  }

  public get isMapPage(): boolean {
    return this.stateManagerService.isMapPage;
  }

  public get isStartPage(): boolean {
    return this.stateManagerService.isStartPage;
  }

  public get activeMarker(): ExtendedMarkerModel {
    return this.stateManagerService.activeMarker;
  }

  private scrollStart(): void {
    if (!this.cookiesService.checkPermission()) {
      this.cookiesService.cookiesFormIsShown = true;
    }
  }

  constructor(
    private applicationRef: ApplicationRef,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ngEl: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public mapFilterService: MapFilterService,
    private overlayService: OverlayService,
    private cookiesService: CookiesService,
    private scriptsLoaderService: ScriptsLoaderService,
    public stateManagerService: StateManagerService,
    private freshchatService: FreshchatService,
    private cookieService: CookiesService,
    private scopertyPlusAdService: ScopertyPlusAdService,
    @Inject(QUERY_PARAMS) private queryParams: Params,
    @Inject(LOCATION) private location: Location,
  ) {
    this.fixNg2BootstrapModalLib();
    this.scrollStart = this.scrollStart.bind(this);
  }

  private fixNg2BootstrapModalLib(): void {
    // FIXME: Dirty fix for issues with the ng2-bootstrap-modal lib in angular >= v5,
    // see https://github.com/ankosoftware/ng2-bootstrap-modal/issues/49.
    // Remove after this library is replaced with a new one.
    Object.defineProperty(this.applicationRef, '_rootComponents', {
      get: () => this.applicationRef['components'],
    });
  }

  ngOnInit() {
    this.cookieService.allCookiesPermitted$
      .subscribe((value) => {
        if (value) {
          this.scriptsLoaderService.loadCookieDependentEnvScripts();
          if (this.analyticsService.isAvailableGA) {
            this.analyticsService.activateAnalytics();
          }
          // this.freshchatService.addFreshchat();  disabled for a while
        }
      });

    this.ngEl.nativeElement.style.height = `${clientHeight()}px`;
    window.addEventListener('resize', () => {
      this.ngEl.nativeElement.style.height = `${clientHeight()}px`;
    });
    this.overlaySubscription = this.overlayService.overlayStatus$.subscribe(
      status => void (this.overlayOn = status)
    );

    const scrollBlock = this.ngEl.nativeElement.querySelector('#scrollBlock');

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isFirstFooter = false;
        }

        if (event instanceof NavigationEnd) {
          let currentRoute = this.actRoute.root;
          while (!isNullOrUndefined(currentRoute.children[0])) {
            currentRoute = currentRoute.children[0];
          }
          this.isFirstFooter = currentRoute.snapshot.data.isFirstFooter;
          scrollTo(scrollBlock, 0, 0);
        }
      });

    this.stateManagerService.isMapPageChanged.subscribe(
      () => this.changeDetectorRef.detectChanges()
    );

    setTimeout(() => this.isInitialScreen = false, 1000);

    if (isSmallDevice()) {
      this.mapFilterService.toggleFiltersShown(false);
    }

    setTimeout(this.scrollStart, SCROLL_TIMEOUT);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (!location.pathname.includes('confirmuser') && this.scopertyPlusAdService.onboardingNeedsToBeOpened) {
        this.scopertyPlusAdService.openScopertyOnBoard();
      }
    });
  }
}
