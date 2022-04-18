import { AfterViewChecked, Component, ElementRef, Input, ViewChild, } from '@angular/core';

import { isEmptyString } from '../../utils/empty-string.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { isMobileDevice$ } from '../../utils/responsive.util';

export type DesktopVideoPosition = 'bottom';

@Component({
  selector: 'app-desktop-video',
  templateUrl: './desktop-video.component.html',
  styleUrls: [
    './desktop-video.component.css',
  ],
})
export class DesktopVideoComponent implements AfterViewChecked {
  @Input() poster: string;
  @Input() multiResolutionPoster: boolean;
  @Input() src: string;
  @Input() autoplay: boolean;
  @Input() loop: boolean;
  @Input() width: string = '100%';
  @Input() brightness: string;
  @Input() videoPosition: DesktopVideoPosition;

  @ViewChild('container') containerElement: ElementRef<HTMLElement>;

  public _name: string = 'desktop-video';

  public isMobileDevice$ = isMobileDevice$;

  public get cssStyle(): { [ cssProperty: string ]: string } {
    if (isEmptyString(this.brightness)) {
      return null;
    }

    return {
      filter: `brightness(${ this.brightness })`,
    };
  }

  public get containerOffset(): number {
    if (isNullOrUndefined(this.elementRef) || isNullOrUndefined(this.containerElement) || isNullOrUndefined(this.videoPosition)) {
      return null;
    }

    if (this.videoPosition === 'bottom') {
      const elementHeight = this.elementRef.nativeElement.offsetHeight;
      const videoHeight = this.containerElement.nativeElement.offsetHeight;

      return elementHeight - videoHeight;
    }

    return null;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewChecked(): void {
    this.containerElement.nativeElement.style.marginTop = `${this.containerOffset}px`;
  }
}
