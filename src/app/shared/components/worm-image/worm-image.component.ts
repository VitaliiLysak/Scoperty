import {
  Component,
  Input,
} from '@angular/core';

import { isEmptyString } from '../../utils/empty-string.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

type WormColor = 'dark-green' | 'green' | 'green-blue' | 'light-blue';

@Component({
  selector: 'app-worm-image',
  templateUrl: './worm-image.component.html',
  styleUrls: [
    './worm-image.component.css',
  ],
})
export class WormImageComponent {
  @Input()
  width: string;

  @Input()
  height: string;

  @Input()
  color: WormColor = 'dark-green';

  @Input()
  rotate: string;

  @Input()
  opacity: number = 1.0;

  public name = 'worm-image';

  public get cssStyle(): { [ cssProperty: string ]: string } {
    const width = isEmptyString(this.width) ? {} : { width: `${ this.width }` };
    const height = isEmptyString(this.height) ? {} : { height: `${ this.height }` };
    const opacity = isNullOrUndefined(this.opacity) ? {} : { opacity: `${ this.opacity }` };
    const transform = isEmptyString(this.rotate) ? {} : { transform: `rotate(${ this.rotate })` };

    return {
      ...width,
      ...height,
      ...opacity,
      ...transform,
    };
  }
}
