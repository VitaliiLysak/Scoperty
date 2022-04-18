import { Component, ContentChild, EventEmitter, Input, Output, } from '@angular/core';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

import { BaseModalBodyDirective } from './base-modal-body.directive';
import { BaseModalFooterDirective } from './base-modal-footer.directive';
import { BaseModalHeaderDirective } from './base-modal-header.directive';
import { BaseModalIconDirective } from './base-modal-icon.directive';
import { BaseModalMessageDirective } from './base-modal-message.directive';
import { BaseModalTitleDirective } from './base-modal-title.directive';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: [
    './base-modal.component.css',
  ],
})
export class BaseModalComponent {
  @Input() locationPrefix: string = '';
  @Input() disableHeader: boolean = false;
  @Input() showMobileNavbar: boolean = true;
  @Input() narrowSpacings: boolean = false;
  @Input() autoOverflowOnContainer = true;

  @Output() logo: EventEmitter<void> = new EventEmitter<void>();
  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  @ContentChild(BaseModalHeaderDirective) headerElement: BaseModalHeaderDirective;
  @ContentChild(BaseModalMessageDirective) messageElement: BaseModalMessageDirective;
  @ContentChild(BaseModalIconDirective) iconElement: BaseModalIconDirective;
  @ContentChild(BaseModalTitleDirective) titleElement: BaseModalTitleDirective;
  @ContentChild(BaseModalBodyDirective) bodyElement: BaseModalBodyDirective;
  @ContentChild(BaseModalFooterDirective) footerElement: BaseModalFooterDirective;

  public _name: string = 'base-modal';

  public get hasHeader(): boolean {
    return !isNullOrUndefined(this.headerElement);
  }

  public get hasMessage(): boolean {
    return !isNullOrUndefined(this.messageElement);
  }

  public get hasIcon(): boolean {
    return !isNullOrUndefined(this.iconElement);
  }

  public get hasTitle(): boolean {
    return !isNullOrUndefined(this.titleElement);
  }

  public get hasFooter(): boolean {
    return !isNullOrUndefined(this.footerElement);
  }

  public onLogoClick(): void {
    this.logo.emit();
  }

  public onDismiss(): void {
    this.dismiss.emit();
  }
}
