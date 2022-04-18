import { Component, Input, } from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';

import { isEmptyString } from '../../utils/empty-string.util';

export const ConfirmationDialogType = {
  Info: 'info',
  Success: 'success',
  Error: 'error',
  Custom: 'custom',
};

const DIALOG_TYPE_ICON_MAP: { [ type: string ]: string } = {
  [ ConfirmationDialogType.Info ]: 'info_outline',
  [ ConfirmationDialogType.Success ]: 'check_circle_outline',
  [ ConfirmationDialogType.Error ]: 'error_outline',
};

export enum ConfirmationDialogResult {
  Link = 'link',
  Button = 'button',
}

export interface ConfirmationDialogModel {
  header?: string;
  title?: string;
  message?: string;
  type: string;
  icon?: string;
  iconSize?: string;
  linkLabel?: string;
  buttonLabel: string;
  buttonId?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: [
    './confirmation-dialog.component.css',
  ],
})
export class ConfirmationDialogComponent implements ConfirmationDialogModel {
  @Input() header: string;
  @Input() title: string;
  @Input() message: string;
  @Input() type: string = ConfirmationDialogType.Info;
  @Input() icon: string;
  @Input() iconSize: string;
  @Input() linkLabel: string;
  @Input() buttonLabel: string;
  @Input() buttonId: string;

  public _name: string = 'confirmation-dialog';

  public get hasHeader(): boolean {
    return !isEmptyString(this.header);
  }

  public get hasIcon(): boolean {
    return !isEmptyString(this.icon);
  }

  public get hasMessage(): boolean {
    return !isEmptyString(this.message);
  }

  public get hasTitle(): boolean {
    return !isEmptyString(this.title);
  }

  public get hasLink(): boolean {
    return !isEmptyString(this.linkLabel);
  }

  public get svgIcon(): string {
    if (this.type === ConfirmationDialogType.Custom) {
      return this.icon;
    }

    return DIALOG_TYPE_ICON_MAP[this.type];
  }

  public get isCustomType(): boolean {
    return this.type === ConfirmationDialogType.Custom;
  }

  constructor(private activeModal: NgxActiveModal) {
  }

  public clickLink(): void {
    this.activeModal.close(ConfirmationDialogResult.Link);
  }

  public onContinue(): void {
    this.activeModal.close(ConfirmationDialogResult.Button);
  }

  public onDismiss(): void {
    this.activeModal.dismiss();
  }
}
