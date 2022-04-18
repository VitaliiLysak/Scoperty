import {
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ng-template[app-form-field-error-message]',
})
export class FormFieldErrorMessageDirective {
  @Input()
  error: string;

  constructor(public templateRef: TemplateRef<any>) {
  }
}
