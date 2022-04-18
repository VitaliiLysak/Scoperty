import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-explanation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css'],
})
export class ExplanationComponent {
  @Input() text: string = '';

  public name: string = 'explanation';
}
