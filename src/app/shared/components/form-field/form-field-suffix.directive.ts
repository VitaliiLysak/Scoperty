import {
  Directive,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appFormFieldSuffix]',
})
export class FormFieldSuffixDirective {
  public get width(): number {
    return this.elementRef.nativeElement.clientWidth;
  }

  constructor(private elementRef: ElementRef) {
  }
}
