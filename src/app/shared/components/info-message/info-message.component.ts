import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: [
    './info-message.component.css',
  ],
})
export class InfoMessageComponent {
  @Input()
  header: string;

  @Input()
  message: string;

  @Input()
  actionLabel: string;

  @Input()
  hasCloseButton: boolean = true;

  @Output()
  action: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  dismiss: EventEmitter<void> = new EventEmitter<void>();

  public _name = 'info-message';

  public get hasHeader(): boolean {
    return this.header && this.header.length > 0;
  }

  public get hasMessage(): boolean {
    return this.message && this.message.length > 0;
  }

  public onActionClick(): void {
    this.action.emit();
  }

  public onDismiss(): void {
    this.dismiss.emit();
  }
}
