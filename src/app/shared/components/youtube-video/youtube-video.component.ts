import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';

import { isEmptyString } from '../../utils/empty-string.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

const YOUTUBE_VIDEO_BASE_URL = 'https://www.youtube.com/embed';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './youtube-video.component.css',
  ],
})
export class YoutubeVideoComponent {
  @Input()
  videoId: string;

  @Input()
  width: string = '480';

  @Input()
  height: string = '360';

  public name: string = 'youtube-video';

  public get hasFrameSrc(): boolean {
    return !isNullOrUndefined(this.frameSrc);
  }

  public get frameSrc(): SafeResourceUrl {
    if (isEmptyString(this.videoId)) {
      return null;
    }

    const videoUrl = `${ YOUTUBE_VIDEO_BASE_URL }/${ this.videoId }`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  constructor(private domSanitizer: DomSanitizer) {
  }
}
