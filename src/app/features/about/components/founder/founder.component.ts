import {
  Component,
  Input,
} from '@angular/core';

import { Founder } from '../../models/founder.model';

const ASSET_FOLDER = 'assets/images/about_us';

@Component({
  selector: 'app-founder',
  templateUrl: './founder.component.html',
  styleUrls: [
    './founder.component.css',
  ],
})
export class FounderComponent {
  @Input()
  founder: Founder;

  public _name: string = 'founder';

  public get imageSrc(): string {
    return `${ ASSET_FOLDER }/${ this.founder.image }`;
  }
}
