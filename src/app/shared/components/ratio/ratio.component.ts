import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ratio',
  templateUrl: './ratio.component.html',
  styleUrls: ['./ratio.component.css']
})
export class RatioComponent implements OnInit {

  @Input() label: string = 'Label';
  @Input() name: string = 'Name';
  @Input() value: string = 'Value';
  @Input() bindValue: string = 'bindValue';
  @Input() size: string = 'large';

  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  public _name: string = 'ratio';

  constructor() { }

  ngOnInit() {
  }

  public onChange(event: any): void {
    this.changed.emit(this.value);
  }

}
