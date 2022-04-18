import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-container[app-panel-content]',
})
export class PanelContentDirective { }
