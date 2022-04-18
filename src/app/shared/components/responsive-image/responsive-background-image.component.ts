import {
  Component,
  HostBinding,
} from '@angular/core';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { WebpAssetService } from '../../../core/services/webp-asset.service';

import { BaseResponsiveImageComponent } from './base-responsive-image.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'div[app-responsive-image]',
  templateUrl: './responsive-image.component.html',
})
export class ResponsiveBackgroundImageComponent extends BaseResponsiveImageComponent {
  @HostBinding('style.background-image')
  get styleBackgroundImageSrc(): string {
    return !isNullOrUndefined(this.src) ? `url(${ this.src })` : null;
  }

  constructor(webImageService: WebpAssetService) {
    super(webImageService);
  }
}
