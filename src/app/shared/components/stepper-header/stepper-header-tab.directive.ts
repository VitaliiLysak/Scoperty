import {
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: 'ng-template[appStepperHeaderTab]',
  exportAs: 'appStepperHeaderTab',
})
export class StepperHeaderTabDirective {
  @Input() name: string;

  constructor(public template: TemplateRef<any>) {
  }
}
