import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: [
    './switch.component.css',
  ],
})
export class SwitchComponent {
  @Input()
  identifier: string;

  @Input()
  value: boolean;

  @Output()
  valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _name: string = 'switch';

  public onModelChange(value: boolean): void {
    this.valueChange.emit(value);
  }
}
