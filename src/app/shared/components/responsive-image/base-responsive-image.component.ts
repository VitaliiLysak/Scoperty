import {
  Input,
  OnChanges,
} from '@angular/core';

import { WebpAssetService } from '../../../core/services/webp-asset.service';

export abstract class BaseResponsiveImageComponent implements OnChanges {
  @Input()
  set src(src: string) {
    this._src = src;
  }
  get src(): string {
    return this._src;
  }
  private _src: string;

  // If true, then 4 (3840px, 1920px, 1440px, 768px) images
  // will be used for rendering depending on screen-size.
  @Input() multiResolution: boolean = false;

  // If false, no webp image will be used.
  @Input() responsive: boolean = true;

  constructor(protected webpAssetService: WebpAssetService) {
  }

  public ngOnChanges(): void {
    const src = this._src;
    this._src = this.responsive ? this.webpAssetService.getImageSrc(src, this.multiResolution) : src;
  }
}
