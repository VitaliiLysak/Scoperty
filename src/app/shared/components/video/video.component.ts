import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

const PLAY_ICON_SCALE_FACTOR: number = 0.44;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [
    './video.component.css',
  ],
})
export class VideoComponent {
  @Input() src: string;

  @ViewChild('video') videoElement: ElementRef;

  name: string = 'video';

  showPlayIcon: boolean = true;

  get playIconSize(): string {
    const elementHeight = this.videoElement.nativeElement.offsetHeight;
    const playIconSize = elementHeight * PLAY_ICON_SCALE_FACTOR;
    return `${ playIconSize }px`;
  }

  playVideo(): void {
    this.showPlayIcon = false;
    this.videoElement.nativeElement.controls = 'auto';
    this.videoElement.nativeElement.play();
  }
}
