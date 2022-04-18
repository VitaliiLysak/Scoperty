import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, } from '@angular/core';

import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounce } from 'lodash';
import { FeatureToggleService } from '../../../../core/services/feature-toggle/feature-toggle.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

interface Counters {
  offers:   number;
  messages: number;
  search:   number;
}

const AVAILABLE_TABS = {
  offers: 'offers',
  myProperty: 'my-property',
  chat: 'chat',
  favorites: 'favorites',
  searchAlerts: 'search-alerts',
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit, OnInit {
  @ViewChild('scrollingMenu')   scrollingMenuElement:   ElementRef;
  @ViewChild('offersTab')       offersTabElement:       ElementRef;
  @ViewChild('properyTab')      properyTabElement:      ElementRef;
  @ViewChild('chatTab')         chatTabElement:         ElementRef;
  @ViewChild('favoritesTab')    favoritesTabElement:    ElementRef;
  @ViewChild('searchAlertsTab') searchAlertsTabElement: ElementRef;

  public _name: string = 'profile';
  public activeItem: string = '';
  public linkToOffers: string = SHARED_ROUTES_NAMES.OFFERS;
  public linkToMyProperty: string = SHARED_ROUTES_NAMES.PROPERTY;
  public linkToChat: string = SHARED_ROUTES_NAMES.PROPERTY;
  public linkToFavorites: string = SHARED_ROUTES_NAMES.FAVORITES;
  public linkToSearchAlerts: string = SHARED_ROUTES_NAMES.SEARCH;
  isNavbar: boolean;

  // @FIXME: later implement notification logic for chat, offers and search-alerts
  public updatesCounters: Counters = {
    offers:   0,
    messages: 0,
    search:   0,
  };

  public get isProfileRoute() {
    return location.pathname === '/profile';
  }

  private setClickedTabPosition(item: string): void {
    /* Will calculate distances between active tab and left border
    and will set left position for the clicked tab */

    let currentTabElement = null;

    if (item === 'offers') {
      currentTabElement = this.offersTabElement;
    } else if (item === 'favorites') {
      currentTabElement = this.favoritesTabElement;
    } else if (item === 'my-property') {
      currentTabElement = this.properyTabElement;
    } else if (item === 'chat') {
      currentTabElement = this.chatTabElement;
    } else if (item === 'search-alerts') {
      currentTabElement = this.searchAlertsTabElement;
    }

    if (currentTabElement != null) {
      requestAnimationFrame(() => {
        const scrollMenuNativeElement = this.scrollingMenuElement.nativeElement;
        const currentTabNativeElement = currentTabElement.nativeElement;

        const currentScrollLeft = scrollMenuNativeElement.scrollLeft;
        const offsetLeftToTabBorder = currentTabNativeElement.offsetLeft;

        if (currentScrollLeft !== offsetLeftToTabBorder) {
          scrollMenuNativeElement.scrollLeft = offsetLeftToTabBorder;
        }
      });
    }
  }

  private activateItem(item: string) {
    this.activeItem = item;
  }

  private checkActiveRoute(event: any): void {
    if (event instanceof NavigationStart || event instanceof NavigationEnd) {
      let activeItemName = ''; // default value, jump to home

      if (event.url === '/profile/offers' && (event as any).urlAfterRedirects === '/profile/offers') {
        activeItemName = 'offers';
      } else if (event.url === '/profile/favorites' && (event as any).urlAfterRedirects === '/profile/favorites') {
        activeItemName = 'favorites';
      } else if (event.url === '/profile/my-property' && (event as any).urlAfterRedirects === '/profile/my-property') {
        activeItemName = 'my-property';
      } else if (event.url === '/profile/chat' && (event as any).urlAfterRedirects === '/profile/chat') {
        activeItemName = 'chat';
      } else if (event.url === '/profile/search-alerts' && (event as any).urlAfterRedirects === '/profile/search-alerts') {
        activeItemName = 'search-alerts';
      }

      this.activateItem(activeItemName);
    }
  }

  constructor(
    private router: Router,
    private stateManagerService: StateManagerService,
    public featureToggleService: FeatureToggleService,
  ) {
    this.router.events.subscribe((event: NavigationStart | NavigationEnd) => {
      this.checkActiveRoute(event);
    });
    this.handleScrollingMenuScroll = debounce(this.handleScrollingMenuScroll.bind(this), 300);
  }

  ngOnInit() {
    this.isNavbarShown();
  }

  public ngAfterViewInit(): void {
    this.setClickedTabPosition(this.activeItem);
  }

  private get tabs(): string[] {
    return [
      AVAILABLE_TABS.offers,
      AVAILABLE_TABS.myProperty,
      AVAILABLE_TABS.chat,
      AVAILABLE_TABS.favorites,
      AVAILABLE_TABS.searchAlerts,
    ]
      .filter((tab: string) => {
        return tab === AVAILABLE_TABS.chat
          ? this.featureToggleService.messaging
          : true;
      });
  }

  @HostListener('scroll', ['$event'])
  public handleScrollingMenuScroll($event) {
    const dashboardTabsName = this.tabs;

    if (this.scrollingMenuElement) {
      const activeTabIndex = Math.round((this.scrollingMenuElement.nativeElement.scrollLeft) /
        this.scrollingMenuElement.nativeElement.clientWidth);

      const activeTabName = dashboardTabsName[activeTabIndex];

      this.handleCurrentTab(activeTabName);
      this.router.navigate([`/profile/${activeTabName}`], { queryParamsHandling: 'merge' });

    }
  }

  public handleCurrentTab(item: string) {
    this.setClickedTabPosition(item);
    this.activateItem(item);
  }

  isNavbarShown() {
    this.isNavbar = this.stateManagerService.isDashboardNavbarShown;
  }
}
