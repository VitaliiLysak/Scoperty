import { TestBed, async, inject } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SelectModule } from 'ng2-select';

import { AppComponent } from '../../app.component';

import { OpenModalService } from './open-modal.service';

import { BEMPipe } from '../../shared/pipes/bem.pipe';
import { FallbackValuePipe } from '../../shared/pipes/fallback-value.pipe';
import { LocaleNumberPipe } from '../../shared/pipes/locale-number.pipe';
import { InvalidValuePipe } from '../../shared/pipes/invalid-value.pipe';
import { BooleanToUserFriendly } from '../../shared/pipes/bool-to-user-friendly.pipe';

import { HeaderComponent } from '../components/header/header.component';
import { LayoutFooterComponent } from '../../core/components/layout-footer/layout-footer.component';
import { HeaderMenuComponent } from '../components/header/header-menu/header-menu.component';
import { SearchPlaceComponent } from '../../shared/components/search-place/search-place.component';
import { CostPerM2Pipe } from '../../shared/pipes/cost-per-m2.pipe';
import { CostPipe } from '../../shared/pipes/cost.pipe';
import { MarkerDetailStatisticsComponent } from '../../shared/components/marker-detail-statistics/marker-detail-statistics.component';
import {
  MarkerDetailEstimatedPriceTrendComponent
} from '../../shared/components/marker-detail-estimated-price-trend/marker-detail-estimated-price-trend.component';
import { MarkerDetailGalleryComponent } from '../../shared/components/marker-detail-gallery/marker-detail-gallery.component';
import { MarkerDetailDataComponent } from '../../shared/components/marker-detail-data/marker-detail-data.component';
import {
  MarkerDetailDataEquipmentComponent
} from '../../shared/components/marker-detail-data-equipment/marker-detail-data-equipment.component';
import {
  MarkerDetailDataDescriptionComponent
} from '../../shared/components/marker-detail-data-description/marker-detail-data-description.component';
import {
  MarkerDetailDataEnergyInfoComponent
} from '../../shared/components/marker-detail-data-energy-info/marker-detail-data-energy-info.component';
import { MarkerDetailDataPlaceComponent } from '../../shared/components/marker-detail-data-place/marker-detail-data-place.component';
import {
  MarkerDetailContactInfoComponent
} from '../../features/profile/components/marker-detail-contact-info/marker-detail-contact-info.component';

describe('Service: OpenModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SelectModule,
      ],
      declarations: [
        HeaderComponent,
        LayoutFooterComponent,
        SearchPlaceComponent,
        HeaderMenuComponent,
        MarkerDetailDataComponent,
        MarkerDetailStatisticsComponent,
        MarkerDetailDataPlaceComponent,
        MarkerDetailEstimatedPriceTrendComponent,
        MarkerDetailGalleryComponent,
        MarkerDetailDataEquipmentComponent,
        MarkerDetailDataDescriptionComponent,
        MarkerDetailDataEnergyInfoComponent,
        MarkerDetailContactInfoComponent,

        BEMPipe,
        CostPerM2Pipe,
        CostPipe,
        FallbackValuePipe,
        LocaleNumberPipe,
        InvalidValuePipe,
        BooleanToUserFriendly,

        RouterOutlet,
        AppComponent,
      ],
      providers: [
        OpenModalService,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ]
    }).compileComponents();
  });

  beforeAll(() => {
    this.appRootElem = document.createElement('app-root');
    document.body.appendChild(this.appRootElem);
  });

  beforeEach(inject([OpenModalService], serv => {
    this.openModalService = serv;
  }));

  it('document has fake app-root tag for the service', async(() => {
    expect(this.appRootElem).toBeTruthy();
  }));

  it('should create instance', async(() => {
    this.openModalService = new OpenModalService();
    expect(this.openModalService).toBeTruthy();
  }));

  it('should call #open', async(() => {
    expect(this.openModalService.open()).toBeUndefined();
  }));

  it('should call #close', async(() => {
    expect(this.openModalService.close()).toBeUndefined();
  }));

  afterAll(() => {
    this.appRootElem = document.querySelector('app-root');
    this.appRootElem.remove();
  });
});
