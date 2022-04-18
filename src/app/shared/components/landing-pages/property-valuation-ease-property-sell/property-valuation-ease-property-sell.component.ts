import { Component } from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

import { PropertyValuationSearchBrokerComponent } from '../property-valuation-search-broker/property-valuation-search-broker.component';

@Component({
  selector: 'app-property-valuation-ease-property-sell',
  templateUrl: './property-valuation-ease-property-sell.component.html',
  styleUrls: [
    './property-valuation-ease-property-sell.component.css',
  ],
})
export class PropertyValuationEasePropertySellComponent {
  constructor(private modalService: NgxModalStack) {}

  searchBroker(): void {
    this.modalService.openFromComponent(PropertyValuationSearchBrokerComponent);
  }
}
