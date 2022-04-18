import {
  Component,
  Input,
} from '@angular/core';

type LoadingIndicatorSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: [
    './loading-indicator.component.css',
  ],
})
export class LoadingIndicatorComponent {
  @Input() size: LoadingIndicatorSize = 'large';

  public _name: string = 'loading-indicator';
}
