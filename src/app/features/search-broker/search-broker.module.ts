import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchBrokerRoutingModule } from './search-broker-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { SearchBrokerComponent } from './pages/search-broker/search-broker.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    SearchBrokerRoutingModule,
    SharedModule
  ],
  declarations: [
    SearchBrokerComponent
  ]
})
export class SearchBrokerModule {
}
