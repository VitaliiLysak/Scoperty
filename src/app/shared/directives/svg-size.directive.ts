import {
  Directive,
  HostBinding,
  Input,
} from '@angular/core';

@Directive({
  selector: 'mat-icon[appSvgSize],mat-icon[appSvgWidth],mat-icon[appSvgHeight]'
})
export class SvgSizeDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appSvgSize') size: string;
  // tslint:disable-next-line:no-input-rename
  @Input('appSvgWidth') width: string;
  // tslint:disable-next-line:no-input-rename
  @Input('appSvgHeight') height: string;

  @HostBinding('style.width') get styleWidth(): string {
    return this.size || this.width;
  }

  @HostBinding('style.height') get styleHeight(): string {
    return this.size || this.height;
  }
}
