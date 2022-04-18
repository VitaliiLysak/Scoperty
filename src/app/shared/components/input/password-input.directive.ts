import {
  Directive,
  ElementRef,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: 'input[appPasswordInput]',
  exportAs: 'appPasswordInput'
})
export class PasswordInputDirective {
  @HostBinding('type')
  get type(): string {
    return this.visible ? 'text' : 'password';
  }

  public visible: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  public toggleVisibility(): void {
    this.visible = !this.visible;
    this.elementRef.nativeElement.focus();
  }
}
