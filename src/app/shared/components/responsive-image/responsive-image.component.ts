import {
  Component,
  HostBinding,
} from '@angular/core';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { WebpAssetService } from '../../../core/services/webp-asset.service';

import { BaseResponsiveImageComponent } from './base-responsive-image.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'img[app-responsive-image]',
  templateUrl: './responsive-image.component.html',
})
export class ResponsiveImageComponent extends BaseResponsiveImageComponent {
  @HostBinding('attr.src')
  get hostSrc(): string {
    return !isNullOrUndefined(this.src) ? this.src : null;
  }

  constructor(webImageService: WebpAssetService) {
    super(webImageService);
  }
}
