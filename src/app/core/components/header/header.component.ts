import { Component, Inject, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Event, NavigationEnd, NavigationStart, Params, Router } from '@angular/router';

import { DialogService } from 'ng2-bootstrap-modal';
import { NgxModalStack } from 'ngx-multi-modal';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LANDING_PAGE_ROUTES, PRIVATE_URLS, SHARED_ROUTES_NAMES, } from '../../../app.constants';
import { WINDOW } from '../../../core/services/window.provider';
import { SignupMobileMenuComponent } from '../../../features/registration/components/signup-mobile-menu/signup-mobile-menu.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MapManagerService } from '../../../core/services/map-manager.service';
import { OpenModalService } from '../../../core/services/open-modal.service';
import { StateManagerService } from '../../../core/services/state-manager.service';
import { OverlayService } from '../../../core/services/overlay.service';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { ShowSignupModalService } from '../../services/show-signup-modal.service';
import { ShowLoginModalService } from '../../services/show-login-modal.service';
import { MapsAutoCompleteService } from '../../../core/services/maps-auto-complete.service';
import { QUERY_PARAMS } from '../../../shared/utils/get-query-params.util';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ScopertyPlusAdService } from '../../services/scoperty-plus-ad.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeOutHeader', [
      transition('* => void', [
        style({height: '307px', opacity: 1, overflow: 'hidden'}),
        animate(500, style({height: '0px', opacity: 0, overflow: 'hidden'}))
      ])

    ]),
    trigger('openDetails', [
      state('true', style({
        width: '480px'
      })),
      state('false',   style({
        width: '0px',
        display: 'none'
      })),
      transition('false => true', animate(600)),
      transition('true => false', animate(600))
    ])
  ]
})

export class HeaderComponent implements OnDestroy, OnInit {
  @ViewChild('searchBarComponent') searchBarComponent: SearchBarComponent;

  name: string = 'navbar';

  linkToProfessionals: string = `/${SHARED_ROUTES_NAMES.PROFESSIONALS}`;
  linkToProperty: string = `/${SHARED_ROUTES_NAMES.PROPERTY}`;
  linkToAbout: string = `/${SHARED_ROUTES_NAMES.ABOUT}`;
  linkToProfile: string = `/${SHARED_ROUTES_NAMES.PROFILE}`;
  linkToHowItWorks: string = `/${SHARED_ROUTES_NAMES.HOWITWORKS}`;
  linkToBroker: string = `${SHARED_ROUTES_NAMES.BROKER}`;
  linkToSearchBroker: string = `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`;
  linkToMap: string = `/${SHARED_ROUTES_NAMES.MAP}`;

  isMobileDevice: boolean = this.document.body.clientWidth < 768;
  isTabletDevice: boolean = this.document.body.clientWidth < 1280;
  isOpenSignupMenu: boolean = false;
  isSidebarFocused = false;

  isOpenSignupMenuMobile: boolean = false;
  isMapIconShown: boolean = false;
  isDashboardMenuOpened: boolean = false;
  menuProfileOpened: boolean = false;

  userNotAuthorized: boolean = true;
  searchClicked: boolean = false;
  profileClicked: boolean = false;
  mapClicked: boolean = false;
  hamburgerClicked: boolean = false;
  searchBig: boolean = false;
  activeSubpage: string;
  previousRoute: string = null;

  searchQuery: string = '';

  private subscriptions: Subscription = new Subscription();

  get locationPath(): boolean {
    // @FIXME: Update style for template and delete this getter
    return true;
  }

  get isMapPage(): boolean {
    return this.stateManagerService.isMapPage;
  }

  get isProfilePage(): boolean {
    return this.stateManagerService.isProfilePage;
  }

  get isSpecialPage(): boolean {
    const path: string = this.window.location.pathname;
    const landingPageRoutes: string[] = LANDING_PAGE_ROUTES.map((landingPageRoute: string) => {
      return `/${ landingPageRoute }`;
    });
    const specialPages: string[] = [
      this.linkToMap,
      ...landingPageRoutes,
    ];

    return specialPages.includes(path);
  }

  constructor(
    private stateManagerService: StateManagerService,
    private featureToggleService: FeatureToggleService,
    private dialogService: DialogService,
    private modalService: NgxModalStack,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private showSignupModalService: ShowSignupModalService,
    private showLoginModalService: ShowLoginModalService,
    private mapManager: MapManagerService,
    private openModalService: OpenModalService,
    private overlayService: OverlayService,
    private scopertyPlusAdService: ScopertyPlusAdService,
    private mapsAutoCompleteService: MapsAutoCompleteService,
    @Inject(QUERY_PARAMS) private queryParams: Params,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Document,
  ) {
    this.listener = this.listener.bind(this);

    // @FIXME: there's no navigation* events when map page is loaded\reloaded
    // so tabs at first time are not underlined
    this.router.events.subscribe((event: NavigationStart | NavigationEnd) => {
      this.checkActiveRoute(event);
    });
  }

  ngOnInit(): void {
    this.userNotAuthorized = !this.authService.isUserLoggedIn();

    const authSubscription = this.authService.events.subscribe(() => {
      this.userNotAuthorized = !this.authService.isUserLoggedIn();
    });
    this.subscriptions.add(authSubscription);

    const routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((newRoute: NavigationEnd) => {
        const pathName = newRoute.url.slice(1);

        this.previousRoute = pathName;
      });

    this.subscriptions.add(routerSubscription);

    this.window.addEventListener('resize', this.listener);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.window.removeEventListener('resize', this.listener);
  }

  openSubpage(page: string): void {
    if (this.isTabletDevice) {
      this.onHamburgerClickFromNavbar();
    }
    this.activeSubpage = page;
  }

  toggleProfileMenu(value?: boolean): void {
    if (arguments.length) this.menuProfileOpened = value;
    else this.menuProfileOpened = !this.menuProfileOpened;
  }

  onLogoClick(): void {
    this.router.navigate(['/'], { queryParamsHandling: 'merge' });
    this.mapManager.resetSettingsToDefaultAndNotify();
  }

  onSearchClick(): void {
    this.profileClicked = false;
    this.mapClicked = false;
    this.searchClicked = !this.searchClicked;
    this.isSidebarFocused = true;
  }

  onProfileClick(): void {
    this.searchClicked = false;
    this.mapClicked = false;

    if (this.userNotAuthorized) {
      this.openSignupMobileMenuModal();
    } else {
      this.profileClicked = !this.profileClicked;
      this.togglesDashboardMenu(false);
    }
  }

  onMapClick(): void {
    this.profileClicked = false;
    this.searchClicked = false;
    this.mapClicked = true;
    this.isMapIconShown = false;
  }

  hideSecondState(): void {
    this.profileClicked = false;
    this.searchClicked = false;
    this.mapClicked = false;
  }

  onHamburgerClickFromNavbar(): void {
    this.closeHeaderMenu();
    this.hamburgerClicked = !this.hamburgerClicked;
  }

  showSignupFromNavbar(): void {
    this.closeHeaderMenu();
    this.isOpenSignupMenuMobile = true;
  }

  showLoginFromNavbar(): void {
    this.closeHeaderMenu();
    this.showLogin();
  }

  logoutFromNavbar(): void {
    this.closeHeaderMenu();
    this.logout();
  }

  closeHeaderMenu(): void {
    this.profileClicked = false;
    this.searchClicked = false;
  }

  togglesDashboardMenu(value): void {
    this.isDashboardMenuOpened = value;
  }

  switchDisplaySignupMenu(menuState?: boolean): void {
    if (arguments.length) this.isOpenSignupMenu = menuState;
    else this.isOpenSignupMenu = !this.isOpenSignupMenu;
  }

  openSignupModal(): void {
    this.authService.setFormSubmissionFromNavigation();
    this.showSignupModalService.openSignUpModal();
  }

  openSignupMobileMenuModal(): void {
    this.modalService.openFromComponent(SignupMobileMenuComponent);
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearUserInfo();
    this.userNotAuthorized = true;
    this.authService.send('logout');
    if (PRIVATE_URLS.includes((/^(.*)#|\B/i.exec(this.router.url) || [])[1] || this.router.url)) {
      this.router.navigate([this.linkToMap], { queryParamsHandling: 'merge' });
    }
  }

  getRedirectUrl(url: string): string {
    const [rootUrl, ...restUrl] = url.split('/').slice(1);
    if (rootUrl === 'profile') return '/';
    return url;
  }

  bigSearchHandler(menuState: boolean): void {
    this.searchBig = menuState;
  }

  private showLogin(): void {
    const {url} = this.router;
    this.getRedirectUrl(url);
    this.showLoginModalService.openLoginModal();
  }

  private checkActiveRoute(event: Event): void {
    if (event instanceof NavigationStart || event instanceof NavigationEnd) {
      if (this.isMobileDevice) {
        this.mapClicked = event.url === this.linkToMap &&
          (event as any).urlAfterRedirects === this.linkToMap;
        this.isMapIconShown = !this.mapClicked;
      } else if (
        event.url === `/${SHARED_ROUTES_NAMES.PROFESSIONALS}`
        && (event as any).urlAfterRedirects === `/${SHARED_ROUTES_NAMES.PROFESSIONALS}`
      ) this.activeSubpage = 'Für Makler';
      else if (
        event.url === `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`
        && (event as any).urlAfterRedirects === `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`
      ) this.activeSubpage = 'Maklersuche';
      else if (
        event.url === `/${SHARED_ROUTES_NAMES.BROKER}`
        && (event as any).urlAfterRedirects === `/${SHARED_ROUTES_NAMES.BROKER}`
      ) this.activeSubpage = 'Baufinanzierung';
      else if (
        event.url === `/${SHARED_ROUTES_NAMES.ABOUT}`
        && (event as any).urlAfterRedirects === `/${SHARED_ROUTES_NAMES.ABOUT}`
      ) this.activeSubpage = 'Über uns';
      else if (
        event.url === `/${SHARED_ROUTES_NAMES.HOWITWORKS}`
        && (event as any).urlAfterRedirects === `/${SHARED_ROUTES_NAMES.HOWITWORKS}`
      ) this.activeSubpage = 'Hilfe';
      else this.activeSubpage = '';
    }
  }

  private listener(): void {
    this.isMobileDevice = this.document.body.clientWidth < 768;
    this.isTabletDevice = this.document.body.clientWidth < 1280;
  }

  openScopertyPlusOnBoard() {
    this.scopertyPlusAdService.openScopertyOnBoard();
  }
}
