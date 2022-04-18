import {
  Component,
  Input,
} from '@angular/core';

export type BaseModalActionsAlign = 'left' | 'center' | 'right' | 'space-between';

@Component({
  selector: 'app-base-modal-actions',
  templateUrl: './base-modal-actions.component.html',
  styleUrls: [
    './base-modal-actions.component.css'
  ],
})
export class BaseModalActionsComponent {
  @Input()
  align: BaseModalActionsAlign = 'center';

  public _name = 'base-modal';
}
