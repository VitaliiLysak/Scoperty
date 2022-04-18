import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

export type AlertType = 'success' | 'error';

const TYPE_ICON_MAP: { [ type: string ]: string } = {
  success: 'tick',
  error: 'error_outline',
};

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './alert.component.css',
  ],
})
export class AlertComponent {
  @Input()
  type: AlertType = 'success';

  name = 'alert';

  get icon(): string {
    return TYPE_ICON_MAP[this.type];
  }
}
