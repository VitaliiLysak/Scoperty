import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { BrokerRoutingModule } from './broker-routing.module';
import { BrokerContactComponent } from './components/broker-contact/broker-contact.component';
import { BrokerFaqComponent } from './components/broker-faq/broker-faq.component';
import { BrokerInterestCheckComponent } from './components/broker-interest-check/broker-interest-check.component';
import { BrokerComponent } from './pages/broker/broker.component';

const COMPONENTS: any[] = [
  BrokerComponent,
  BrokerContactComponent,
  BrokerFaqComponent,
  BrokerInterestCheckComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    BrokerRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class BrokerModule {
}
