import {
  Directive,
  Input,
} from '@angular/core';

export type BaseModalFooterTheme = 'light' | 'dark';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-base-modal-footer]',
})
export class BaseModalFooterDirective {
  @Input()
  theme: BaseModalFooterTheme = 'light';
}
