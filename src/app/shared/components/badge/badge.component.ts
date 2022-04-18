import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: [
    './badge.component.css',
  ],
})
export class BadgeComponent {
  @Input() text: string;
  @Input() rotate: string;
  @Input() size: string = '160px';
  @Input() fontSize: string = '16px';

  public _name: string = 'badge';

  public get cssRotate(): string {
    return `rotate(${ this.rotate })`;
  }
}
