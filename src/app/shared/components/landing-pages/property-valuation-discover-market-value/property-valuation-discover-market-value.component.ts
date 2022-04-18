import { Component, Inject, Input, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';

import { FindPropertyComponent } from '../../find-property/find-property.component';
import { isEmptyString } from '../../../utils/empty-string.util';
import { isMobileDevice, isMobileDevice$ } from '../../../utils/responsive.util';
import { LANDING_PAGES, LAST_LANDING_QUERY_PARAM, SHARED_ROUTES_NAMES } from '../../../../app.constants';

import { POPUP_ANIMATIONS } from './property-valuation-discover-market-value.animation';
import { LOCATION } from '../../../../core/services/location.provider';
import { QueryParamsService } from '../../../../core/services/query-params.service';

@Component({
  selector: 'app-property-valuation-discover-market-value',
  templateUrl: './property-valuation-discover-market-value.component.html',
  styleUrls: [
    './property-valuation-discover-market-value.component.css',
  ],
  animations: POPUP_ANIMATIONS,
})
export class PropertyValuationDiscoverMarketValueComponent implements OnInit {
  @Input() heading: string;
  @Input() subHeading: string;
  @Input() listText: string;
  @Input() bannerText: string = 'Jetzt in Berlin, Hamburg, München, Köln, Frankfurt und Nürnberg!';
  @Input() findPropertyInputLabel: string = 'Einfach Adresse eingeben und Schätzwert einsehen.';
  @Input() findPropertyButtonTitle: string;
  @Input() findPropertyButtonTitleMobile: string;

  @ViewChild('findProperty') findPropertyComponent: FindPropertyComponent;

  public name: string = 'property-valuation-discover-market-value';
  isUnsupportedCityPopupOpen: boolean = false;
  isMobileDevice$ = isMobileDevice$;

  get hasSubheading(): boolean {
    return !isEmptyString(this.subHeading);
  }

  get unsupportedCityPopupHeight(): string {
    const { offsetTop, clientHeight } = this.findPropertyComponent.nativeElement;
    const popupHeight = (offsetTop + clientHeight) - 16;
    return isMobileDevice() ? `${ popupHeight }px` : 'auto';
  }

  constructor(
    private router: Router,
    @Inject(LOCATION) private location: Location,
    private queryParamsService: QueryParamsService
  ) {
  }

  ngOnInit(): void {
    this.setLandingQueryParam();
  }

  setLandingQueryParam() {
    const landing = this.location.pathname.substring(1);

    if (!LANDING_PAGES.includes(landing)) {
      return;
    }

    const queryParams = {};

    queryParams[LAST_LANDING_QUERY_PARAM] = landing;

    this.queryParamsService.changeQueryParamsViaAngularRouter(queryParams);
  }

  public goToMap(): void {
    this.hideUnsupportedCityPopup();
    this.router.navigate([`/${SHARED_ROUTES_NAMES.MAP}`], { queryParamsHandling: 'merge' });
  }

  showUnsupportedCityPopup(): void {
    this.isUnsupportedCityPopupOpen = true;
  }

  hideUnsupportedCityPopup(): void {
    this.isUnsupportedCityPopupOpen = false;
  }
}
