import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScreenSize, ScreenSizeService, } from '../../../../core/services/screen-size.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { isMobileDevice } from '../../../../shared/utils/responsive.util';

const VIDEO_MAX_HEIGHT = 720;
const NAVBAR_ID = 'start-page-navbar';

@Component({
  selector: 'app-start-page-header',
  templateUrl: './start-page-header.component.html',
  styleUrls: [
    './start-page-header.component.css',
  ],
})
export class StartPageHeaderComponent {
  @ViewChild('description') descriptionElement: ElementRef<HTMLElement>;
  @ViewChild('videoMask') videoMaskElement: ElementRef<HTMLElement>;

  public _name = 'start-page-header';

  private get navBar(): HTMLElement {
    return this.document.getElementById(NAVBAR_ID);
  }

  public containerMaxHeight$: Observable<number> = this.screenSizeService.screenSize$.pipe(
    map(({ height: screenHeight }: ScreenSize) => {
      if (isMobileDevice()) {
        return null;
      }

      if (isNullOrUndefined(this.descriptionElement) || isNullOrUndefined(this.videoMaskElement) || isNullOrUndefined(this.navBar)) {
        return VIDEO_MAX_HEIGHT;
      }

      const descriptionHeight = this.descriptionElement.nativeElement.clientHeight;
      const videoMaskHeight = this.videoMaskElement.nativeElement.clientHeight;
      const navbarHeight = this.navBar.clientHeight;
      const spacing = 16;
      const baseMaxHeight = (screenHeight / 2) + videoMaskHeight;
      const minHeight = navbarHeight + (spacing * 2) + descriptionHeight + videoMaskHeight;
      const maxHeightCorrected = Math.min(baseMaxHeight, VIDEO_MAX_HEIGHT);
      const minHeightCorrected = Math.max(maxHeightCorrected, minHeight);

      return minHeightCorrected;
    }),
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private screenSizeService: ScreenSizeService,
  ) {
  }
}
