import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-expandable-panel',
  templateUrl: './expandable-panel.component.html',
  styleUrls: [
    './expandable-panel.component.css',
  ],
})
export class ExpandablePanelComponent {
  @Input() heading: string;
  @Input() show: boolean = true;

  name: string = 'expandable-panel';

  get expandIcon(): string {
    return this.show ? 'expand_more' : 'expand_less';
  }

  toggleBodyVisibility(): void {
    this.show = !this.show;
  }
}
