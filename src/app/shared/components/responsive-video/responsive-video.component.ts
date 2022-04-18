import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';

import { WebpAssetService } from '../../../core/services/webp-asset.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../core/services/logger/logger.service';

@Component({
  selector: 'app-responsive-video',
  templateUrl: './responsive-video.component.html',
  styleUrls: [
    './responsive-video.component.css',
  ],
})
export class ResponsiveVideoComponent implements OnChanges, AfterViewInit {
  @Input()
  set poster(poster: string) {
    this._poster = poster;
  }
  get poster(): string {
    return this._poster;
  }
  private _poster: string;

  // If true, then 4 (3840px, 1920px, 1440px, 768px) images
  // will be used for rendering depending on screen-size.
  @Input()
  multiResolutionPoster: boolean;

  @Input()
  set src(src: string) {
    this._src = src;
  }
  get src(): string {
    return this._src;
  }
  private _src: string;

  @Input()
  autoplay: boolean;

  @Input()
  loop: boolean;

  @Input()
  width: string = '100%';

  @ViewChild('video')
  videoElement: ElementRef;

  public name = 'responsive-video';

  private get nativeElement(): any {
    return this.videoElement.nativeElement;
  }

  constructor(
    private webpAssetService: WebpAssetService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  public ngOnChanges(): void {
    this._poster = this.webpAssetService.getImageSrc(this.poster, this.multiResolutionPoster);
    this._src = this.webpAssetService.getVideoSrc(this.src);
  }

  public ngAfterViewInit(): void {
    this.playVideo();
  }

  private playVideo(): void {
    // INFO: Setting the muted property and playing the video in the code
    // because sometimes the autoplay attribute fails in Chrome v73 with a DOMException.
    this.nativeElement.muted = this.autoplay;
    this.nativeElement.play()
      .then(() => {
        this.logger.info('ResponsiveVideoComponent::nativeElement::play()', this.src);
      }, error => {
        this.logger.error('ResponsiveVideoComponent::nativeElement::play()', error);
      });
  }
}
