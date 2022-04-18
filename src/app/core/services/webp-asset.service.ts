import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';

import { isEmptyString } from '../../shared/utils/empty-string.util';

import { BrowserService } from './browser.service';

const FILE_PATH_SEPARATOR = '/';

@Injectable()
export class WebpAssetService {
  private get multiResolutionAssetWidth(): number {
    // FIXME: Use cdk and BreakpointObserver instead.
    const displayWidth = this.document.body.clientWidth;

    if (displayWidth > 1920) {
      return 3840;
    }

    if (displayWidth > 1440 && displayWidth <= 1920) {
      return 1920;
    }

    if (displayWidth > 768 && displayWidth <= 1440) {
      return 1440;
    }

    return 768;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private browserService: BrowserService,
  ) {
  }

  public getImageSrc(src: string, multiResolution: boolean): string {
    if (isEmptyString(src)) {
      return '';
    }

    const fallbackFileType = this.getSrcFileType(src);
    const srcWithoutFileType = this.getSrcWithoutFileType(src);
    const fileType = this.getImageFileType(fallbackFileType);
    if (!multiResolution) {
      return `${ srcWithoutFileType }.${ fileType }`;
    }

    return `${ srcWithoutFileType }_${ this.multiResolutionAssetWidth }.${ fileType }`;
  }

  private getImageFileType(fallbackFileType: string): string {
    return this.browserService.canIUseWebP ? 'webp' : fallbackFileType;
  }

  public getVideoSrc(src: string): string {
    if (isEmptyString(src)) {
      return '';
    }

    const fallbackFileType = this.getSrcFileType(src);
    const srcWithoutFileType = this.getSrcWithoutFileType(src);
    const fileType = this.getVideoFileType(fallbackFileType);
    return `${ srcWithoutFileType }.${ fileType }`;
  }

  private getVideoFileType(fallbackFileType: string): string {
    return this.browserService.canIUseWebP ? 'webm' : fallbackFileType;
  }

  private getSrcWithoutFileType(src: string): string {
    const srcComponents = src.split(FILE_PATH_SEPARATOR);
    const srcFileName = srcComponents[srcComponents.length - 1].split('.')[0];
    const srcBasePath = srcComponents.slice(0, -1).join(FILE_PATH_SEPARATOR);
    const srcWithoutFileType = [ srcBasePath, srcFileName ].join(FILE_PATH_SEPARATOR);

    return srcWithoutFileType;
  }

  private getSrcFileType(src: string): string {
    const srcComponents = src.split(FILE_PATH_SEPARATOR);
    const srcFileNameComponent = srcComponents[srcComponents.length - 1].split('.');
    const srcFileType = srcFileNameComponent[srcFileNameComponent.length - 1];

    return srcFileType;
  }
}
