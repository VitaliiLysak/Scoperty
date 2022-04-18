import { Component } from '@angular/core';

@Component({
  selector: 'app-start-page-sell-property',
  templateUrl: './start-page-sell-property.component.html',
  styleUrls: ['./start-page-sell-property.component.css']
})
export class StartPageSellPropertyComponent {
  public _name: string = 'start-page-sell-property';

  public descriptionTexts: Array<string> = [
    'Hol dir den Schätzwert deiner Immobilie mit nur einem Klick',
    'Füge Daten hinzu und verbessere die Genauigkeit deines Schätzwertes',
    'Finde heraus was Käufer wirklich bereit sind für deine Immobilie zu zahlen'
  ];
}
