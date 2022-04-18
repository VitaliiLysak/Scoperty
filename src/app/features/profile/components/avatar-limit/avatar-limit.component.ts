import { Component } from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

@Component({
  selector: 'app-avatar-limit',
  templateUrl: './avatar-limit.component.html',
  styleUrls: ['./avatar-limit.component.css'],
})

export class AvatarLimitComponent {
  public _name: string = 'avatar-limit';

  constructor(
    public activeModal: NgxActiveModal,
  ) { }

  public apply(result: boolean): void {
    this.activeModal.close(result);
  }

  public onDismiss(): void {
    this.activeModal.dismiss();
  }
}
