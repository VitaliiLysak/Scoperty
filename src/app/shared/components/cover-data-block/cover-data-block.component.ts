import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

type CoverDataBlockBackgroundColor = 'white' | 'light';
type CoverDataBlockButtonSize = 'small' | 'medium';

@Component({
  selector: 'app-cover-data-block',
  templateUrl: './cover-data-block.component.html',
  styleUrls: [
    './cover-data-block.component.css',
  ],
})
export class CoverDataBlockComponent {
  @Input() text: string;
  @Input() buttonSize: CoverDataBlockButtonSize;
  @Input() narrow: boolean = false;
  @Input() backgroundColor: CoverDataBlockBackgroundColor = 'white';

  @Output() showSignup: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'cover-data-block';

  public emitSignup(): void {
    this.showSignup.emit();
  }
}
