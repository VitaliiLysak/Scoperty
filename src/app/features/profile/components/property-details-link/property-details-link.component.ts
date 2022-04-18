import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-property-details-link',
  templateUrl: './property-details-link.component.html',
  styleUrls: [
    './property-details-link.component.css',
  ],
})
export class PropertyDetailsLinkComponent {
  @Input()
  propertyId: number;

  public _name = 'property';
}
