import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() name: string = 'Name';
  @Input() inputId: string;
  @Input() checked: boolean = false;
  @Input() required: boolean = false;
  @Input() mods: { [modification: string]: string } = {};

  @Output() changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _name: string = 'checkbox';

  constructor() { }

  ngOnInit() {
  }

  public onChange(event: any): void {
    this.checked = !this.checked;
    this.changed.emit(this.checked);
  }

}
