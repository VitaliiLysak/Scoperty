import {
  Directive,
  Input,
} from '@angular/core';

export type BaseModalTitleAlign = 'left' | 'center';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-base-modal-title]',
})
export class BaseModalTitleDirective {
  @Input()
  align: BaseModalTitleAlign = 'center';
}
