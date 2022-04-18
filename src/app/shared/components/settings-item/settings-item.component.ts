import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-settings-item',
  templateUrl: './settings-item.component.html',
  styleUrls: [
    './settings-item.component.css',
  ],
})
export class SettingsItemComponent {
  @Input()
  identifier: string;

  @Input()
  label: string; // INFO: If no label is provided then the switch value is used as a label

  @Input()
  message: string;

  @Input()
  value: boolean;

  @Output()
  valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _name: string = 'settings-item';

  public onValueChange(newValue: boolean): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
