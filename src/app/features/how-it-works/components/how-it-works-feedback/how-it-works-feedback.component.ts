import {
  Component,
  Input,
} from '@angular/core';

export type FeedbackType = 'success' | 'error';

@Component({
  selector: 'app-how-it-works-feedback',
  templateUrl: './how-it-works-feedback.component.html',
  styleUrls: [
    './how-it-works-feedback.component.css',
  ],
})
export class HowItWorksFeedbackComponent {
  @Input() type: FeedbackType = 'success';
  @Input() heading: string = '';
  @Input() message: string = '';

  name: string = 'how-it-works-feedback';

  get svgIcon(): string {
    return this.type === 'success' ? 'tick' : 'error_outline';
  }
}
