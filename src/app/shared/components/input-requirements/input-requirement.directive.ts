import {
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-template[app-input-requirement]',
})
export class InputRequirementDirective {
  @Input()
  requirement: string;

  constructor(public templateRef: TemplateRef<any>) {
  }
}
