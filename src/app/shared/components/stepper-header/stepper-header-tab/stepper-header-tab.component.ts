import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-stepper-header-tab',
  templateUrl: './stepper-header-tab.component.html',
  styleUrls: [
    './stepper-header-tab.component.css',
  ],
})
export class StepperHeaderTabComponent {
  @Input() position: number;
  @Input() name: string;
  @Input() active: boolean;

  public _name: string = 'stepper-header-tab';
}
