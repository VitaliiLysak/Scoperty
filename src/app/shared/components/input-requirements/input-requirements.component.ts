import {
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputRequirementDirective } from './input-requirement.directive';

type InputRequirementsMode = 'default' | 'small';

@Component({
  selector: 'app-input-requirements',
  templateUrl: './input-requirements.component.html',
  styleUrls: [
    './input-requirements.component.css',
  ],
})
export class InputRequirementsComponent {
  @Input()
  mode: InputRequirementsMode = 'default';
  @Input()
  control: FormControl;

  @ContentChildren(InputRequirementDirective)
  requirementElementList: QueryList<InputRequirementDirective>;

  _name = 'input-requirements';

  isRequirementFulfilled(requirement: string): boolean {
    const controlTouched = this.control.dirty || this.control.touched;
    return controlTouched && !this.control.hasError(requirement);
  }

  trackByRequirementElement(index: number, requirementElement: InputRequirementDirective): string {
    return requirementElement.requirement;
  }
}
