import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-start-page-tabs-description',
  templateUrl: './start-page-tabs-description.component.html',
  styleUrls: ['./start-page-tabs-description.component.css']
})
export class StartPageTabsDescriptionComponent {
  @Input() descriptionTexts: Array<string>;

  public _name: string = 'start-page-tabs-description';
}
