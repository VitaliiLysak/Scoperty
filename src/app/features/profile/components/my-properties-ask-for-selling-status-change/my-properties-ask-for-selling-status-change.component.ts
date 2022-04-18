import { Component } from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

@Component({
  selector: 'app-my-properties-ask-for-selling-status-change',
  templateUrl: './my-properties-ask-for-selling-status-change.component.html',
  styleUrls: [
    './my-properties-ask-for-selling-status-change.component.css',
  ],
})
export class MyPropertiesAskForSellingStatusChangeComponent {
  public _name: string = 'my-properties-ask-for-selling-status-change';

  public openForOffers: boolean = true;

  constructor(private activeModal: NgxActiveModal) {
  }

  public onDismiss(): void {
    this.activeModal.dismiss();
  }

  public onChangeSellingStatus(): void {
    this.activeModal.close(this.openForOffers);
  }
}
