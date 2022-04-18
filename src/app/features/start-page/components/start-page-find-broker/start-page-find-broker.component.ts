import { Component } from '@angular/core';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-start-page-find-broker',
  templateUrl: './start-page-find-broker.component.html',
  styleUrls: [
    './start-page-find-broker.component.css',
  ],
})
export class StartPageFindBrokerComponent {
  public _name: string = 'start-page-find-broker';

  public linkToSearchBroker: string = `/${SHARED_ROUTES_NAMES.SEARCHBROKER}`;
}
