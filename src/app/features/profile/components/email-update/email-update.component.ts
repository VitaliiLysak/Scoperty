import { Component } from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.component.html',
  styleUrls: ['./email-update.component.css'],
})

export class EmailUpdateComponent {
  public _name: string = 'email-update';

  constructor(
    public activeModal: NgxActiveModal,
  ) { }

  public close(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
