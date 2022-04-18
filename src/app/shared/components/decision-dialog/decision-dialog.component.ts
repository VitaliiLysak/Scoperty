import {
  Component,
  Input,
} from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

export const DecisionDialogType = {
  Info: 'info',
  Success: 'success',
  Error: 'error',
  Custom: 'custom',
};

export const DecisionButtonType = {
  Cancel: 'cancel',
  Destructive: 'destructive',
  Default: 'default',
};

const BUTTON_TYPE_BUTTON_COLOR_MAP: { [ buttonType: string ]: string } = {
  [ DecisionButtonType.Cancel ]: 'green',
  [ DecisionButtonType.Destructive ]: 'delete',
  [ DecisionButtonType.Default ]: 'primary-green',
};

const DIALOG_TYPE_ICON_MAP: { [ dialogType: string ]: string } = {
  [ DecisionDialogType.Info ]: 'info_outline',
  [ DecisionDialogType.Success ]: 'check_circle_outline',
  [ DecisionDialogType.Error ]: 'error_outline',
};

export interface DecisionDialogModel {
  title: string;
  message: string;
  type: string;
  icon?: string;
  buttons: DecisionButtonModel[];
}

interface DecisionButtonModel {
  name: string;
  type: string;
  label: string;
  id?: string;
}

@Component({
  selector: 'app-decision-dialog',
  templateUrl: './decision-dialog.component.html',
  styleUrls: [
    './decision-dialog.component.css',
  ],
})
export class DecisionDialogComponent implements DecisionDialogModel {
  @Input() title: string;
  @Input() message: string;
  @Input() type: string = DecisionDialogType.Info;
  @Input() icon: string;
  @Input() buttons: DecisionButtonModel[];

  public _name: string = 'decision-dialog';

  public get svgIcon(): string {
    if (this.type === DecisionDialogType.Custom) {
      return this.icon;
    }

    return DIALOG_TYPE_ICON_MAP[this.type];
  }

  constructor(private activeModal: NgxActiveModal) {
  }

  public getButtonStyle(button: DecisionButtonModel): string {
    return this.isButtonOfTypeCancel(button) ? 'link' : 'button';
  }

  public getButtonColor(button: DecisionButtonModel): string {
    if (this.isButtonOfTypeDestructive(button)) {
      return BUTTON_TYPE_BUTTON_COLOR_MAP[DecisionButtonType.Destructive];
    }

    if (this.isButtonOfTypeCancel(button)) {
      return BUTTON_TYPE_BUTTON_COLOR_MAP[DecisionButtonType.Cancel];
    }

    return BUTTON_TYPE_BUTTON_COLOR_MAP[DecisionButtonType.Default];
  }

  public onContinue(button: DecisionButtonModel): void {
    this.activeModal.close(button.name);
  }

  public onDismiss(): void {
    this.activeModal.dismiss();
  }

  private isButtonOfTypeDestructive(button: DecisionButtonModel): boolean {
    return button.type === DecisionButtonType.Destructive;
  }

  private isButtonOfTypeCancel(button: DecisionButtonModel): boolean {
    return button.type === DecisionButtonType.Cancel;
  }
}
