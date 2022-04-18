import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPopperModule } from 'ngx-popper';
import { NgxMultiModalModule } from 'ngx-multi-modal';
import { NouisliderModule } from 'ng2-nouislider';

import { SharedModule } from '../../shared/shared.module';

import { PropertySearchRoutingModule } from './property-search-routing.module';
import { FancyInfoWindowComponent } from './components/fancy-info-window/fancy-info-window.component';
import { HintNoMarkersComponent } from './components/no-markers-hint/no-markers-hint.component';
import { MapComponent } from './components/map/map.component';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { MapFiltersComponent } from './components/map-filters/map-filters.component';
import { MapDataShaderLegendComponent } from './components/map-data-shader-legend/map-data-shader-legend.component';
import { MapDataSourceComponent } from './components/map-data-source/map-data-source.component';
import { PropertySearchComponent } from './pages/property-search/property-search.component';
import { PropertyViewComponent } from './components/fancy-info-window/property-view/property-view.component';
import { QuestionButtonComponent } from './components/map-filters/question-button/question-button.component';
import { SearchRequestButtonComponent } from './components/map-filters/search-request-button/search-request-button.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarObjectComponent } from './components/sidebar-object/sidebar-object.component';
import { SaveSearchAlertNameComponent } from './components/save-search-alert-name/save-search-alert-name.component';
import { SearchAlertPopupComponent } from './components/search-alert-popup/search-alert-popup.component';
// import { SearchAlertMapComponent } from './components/save-search-alert-name/search-alert-map/search-alert-map.component';
// import { SearchRadiusControlComponent } from './components/search-radius-control/search-radius-control.component';
import { PropertyPaginationComponent } from './components/fancy-info-window/property-pagination/property-pagination.component';
import {
  ScopertyPlusPropertyViewComponent
} from './components/fancy-info-window/scoperty-plus-property-view/scoperty-plus-property-view.component';

const COMPONENTS: any[] = [
  FancyInfoWindowComponent,
  HintNoMarkersComponent,
  MapComponent,
  MapControlsComponent,
  MapDataShaderLegendComponent,
  MapDataSourceComponent,
  MapFiltersComponent,
  PropertySearchComponent,
  QuestionButtonComponent,
  SearchRequestButtonComponent,
  SidebarComponent,
  SidebarObjectComponent,
  SearchAlertPopupComponent,
  // SearchAlertMapComponent,
  PropertyPaginationComponent
];

const ENTRY_COMPONENTS: any[] = [
  PropertyViewComponent,
  SaveSearchAlertNameComponent,
  // SearchRadiusControlComponent,
  ScopertyPlusPropertyViewComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPopperModule,
    NgbPopoverModule,
    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),
    NouisliderModule,

    PropertySearchRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ]
})
export class PropertySearchModule {
}
