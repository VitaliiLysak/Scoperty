import { Directive, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-panel-title]',
})
export class PanelTitleDirective { }
