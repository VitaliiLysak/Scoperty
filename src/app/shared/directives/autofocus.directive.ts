import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { isTabletDevice } from '../utils/responsive.util';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {
  private _autofocus;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this._autofocus || typeof this._autofocus === 'undefined') {
      // For SSR (server side rendering) this is not safe.
      // Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)

      if (isTabletDevice()) { return; }

      // Dumbfix for ExpressionChangedAfterItHasBeenCheckedError
      // In next refactor iteration should be replaced with better solution
      setTimeout(() => {
          this.el.nativeElement.focus();
      }, 0);
    }
  }

  /*ngAfterViewInit() {
    if (this._autofocus || typeof this._autofocus === 'undefined')
      //this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
      this.el.nativeElement.focus();
  }*/

  @Input() set appAutofocus(condition: boolean) {
    this._autofocus = condition !== false;
  }
}
