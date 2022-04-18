import {
  Component,
  Input, Output,
  EventEmitter,
} from '@angular/core';

interface EventSaveProperty {
  target: any;
}

@Component({
  selector: 'app-marker-detail-data-description',
  templateUrl: './marker-detail-data-description.component.html',
  styleUrls: ['./marker-detail-data-description.component.css']
})

export class MarkerDetailDataDescriptionComponent {
  @Input() model: any = null;
  @Input() mode: 'edit'|'show' = 'show';
  @Input() label: string;
  @Input() descriptionArea: string;

  @Output() changeProperty: EventEmitter<any> = new EventEmitter<any>();

  public descriptionTextarea: string = '';

  public name: string = 'marker-detail-data-description';

  saveProperty({target}: EventSaveProperty, key: string): void {
    const {value} = target;
    this.changeProperty.emit({key, value});
  }
}
