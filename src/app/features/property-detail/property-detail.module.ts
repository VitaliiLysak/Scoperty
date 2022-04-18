import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TextMaskModule } from 'angular2-text-mask';
import { NouisliderModule } from 'ng2-nouislider';
import { NgxMultiModalModule } from 'ngx-multi-modal';

import { SharedModule } from '../../shared/shared.module';

import { PropertyDetailRoutingModule } from './property-detail-routing.module';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { MarketViewPropertyComponent } from './components/market-view-property/market-view-property.component';
import { OverviewPropertyComponent } from './components/overview-property/overview-property.component';
import { PropertyDetailHeaderComponent } from './components/property-detail-header/property-detail-header.component';
import { VisitSurroundingsWindowComponent } from './components/visit-surroundings/visit-surroundings.component';
import { StreetViewComponent } from './components/street-view/street-view.component';
import {
  ApartmentOverviewComponent
} from './components/property-detail-apartment-overview/property-detail-apartment-overview.component';
import { AddApartmentComponent } from './components/property-detail-add-apartment/property-detail-add-apartment.component';
import { ApartmentListComponent } from './components/property-detail-apartment-list/property-detail-apartment-list.component';
import {
  ApartmentListItemComponent
} from './components/property-detail-apartment-list-item/property-detail-apartment-list-item.component';
import { PropertyDetailImagesComponent } from './components/property-detail-images/property-detail-images.component';
import { PropertyDetailInfoComponent } from './components/property-detail-info/property-detail-info.component';
import { PropertyDetailSellPropertyComponent } from './components/property-detail-sell-property/property-detail-sell-property.component';
import { PropertyDetailSimpleHeaderComponent } from './components/property-detail-simple-header/property-detail-simple-header.component';

const COMPONENTS: any[] = [
  MarketViewPropertyComponent,
  OverviewPropertyComponent,
  PropertyDetailHeaderComponent,
  VisitSurroundingsWindowComponent,
  StreetViewComponent,
  AddApartmentComponent,
  ApartmentListComponent,
  ApartmentListItemComponent,
  ApartmentOverviewComponent,

  PropertyDetailComponent,
  PropertyDetailImagesComponent,
  PropertyDetailInfoComponent,
  PropertyDetailSellPropertyComponent,
  PropertyDetailSimpleHeaderComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),
    NouisliderModule,
    TextMaskModule,

    PropertyDetailRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class PropertyDetailModule {
}
