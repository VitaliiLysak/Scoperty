import { Directive, Input } from '@angular/core';

export type BaseModalIconAlign = 'left' | 'center';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-base-modal-icon]',
})
export class BaseModalIconDirective {
  @Input()
  align: BaseModalIconAlign = 'center';

  @Input()
  alignMobile: BaseModalIconAlign = 'center';
}
