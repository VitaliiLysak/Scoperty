import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-property-detail-sell-property',
  templateUrl: './property-detail-sell-property.component.html',
  styleUrls: [
    './property-detail-sell-property.component.css',
  ],
})
export class PropertyDetailSellPropertyComponent {
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  public name: string = 'property-detail-sell-property';

  public listItems: string[] = [
    'Immobilienwert bestimmen',
    'Attraktivität am Markt testen',
    'Verkaufsstrategie festlegen',
  ];

  public clickButton(): void {
    this.buttonClick.emit();
  }
}
