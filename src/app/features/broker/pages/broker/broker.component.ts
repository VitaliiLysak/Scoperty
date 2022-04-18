import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { WINDOW } from '../../../../core/services/window.provider';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit, OnDestroy {
  public _name: string = 'page-broker';

  public isOnlyTabletDevice: boolean = this.document.body.clientWidth >= 761 && this.document.body.clientWidth < 1181;
  public linkToMortgageRequest: string[] = [ `/${SHARED_ROUTES_NAMES.MORTGAGE_REQUEST}` ];

  private listener(): void {
    this.isOnlyTabletDevice = this.document.body.clientWidth >= 761 && this.document.body.clientWidth < 1181;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
  ) {
    this.listener = this.listener.bind(this);
  }

  public ngOnInit(): void {
    this.window.addEventListener('resize', this.listener);
  }

  public ngOnDestroy(): void {
    this.window.removeEventListener('resize', this.listener);
  }
}
