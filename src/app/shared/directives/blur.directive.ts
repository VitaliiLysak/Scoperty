import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidateOnBlur]',
})

export class BlurDirective {
  @Input() validateFormControl;

  constructor() { }

  @HostListener('focus', ['$event.target'])
    onFocus(target) {
      this.validateFormControl.markAsUntouched();
    }

  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    this.validateFormControl.markAsTouched();
  }
}
