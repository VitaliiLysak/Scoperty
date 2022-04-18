import {
  Directive,
  Input,
} from '@angular/core';

export type BaseModalHeaderAlign = 'left' | 'center';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-base-modal-header]',
})
export class BaseModalHeaderDirective {
  @Input()
  align: BaseModalHeaderAlign = 'center';

  @Input()
  alignMobile: BaseModalHeaderAlign = 'center';
}
