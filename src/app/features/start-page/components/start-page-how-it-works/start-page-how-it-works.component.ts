import { Component } from '@angular/core';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-start-page-how-it-works',
  templateUrl: './start-page-how-it-works.component.html',
  styleUrls: [
    './start-page-how-it-works.component.css',
  ],
})
export class StartPageHowItWorksComponent {
  public _name: string = 'start-page-how-it-works';
  public linkToHowItWorks: string = `/${SHARED_ROUTES_NAMES.HOWITWORKS}`;
}
