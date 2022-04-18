import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnInit, Inject,
} from '@angular/core';

import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

declare var $: any;

type ObjectSliderCarouselDirection = 'next' | 'prev';

const CAROUSEL_DID_END_SLIDING = 'slid.bs.carousel';

@Component({
  selector: 'app-object-slider',
  templateUrl: './object-slider.component.html',
  styleUrls: ['./object-slider.component.css']
})
export class ObjectSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') markersCarousel: ElementRef;

  @Input() locationPrefix: string = '';
  @Input() markers: Array<Array<ExtendedMarkerModel>>;
  @Input() isLoaded: boolean;
  @Input() titleText: string;

  name: string = 'object-slider';

  private carouselIsSliding = false;

  // FIXME: Remove BootstrapJS/jQuery dependency
  private get $carousel(): any {
    const carouselElement = this.markersCarousel.nativeElement;
    return $(carouselElement);
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.transformMarkersOnMobile();
  }

  ngAfterViewInit(): void {
    this.handleCarouselSlideEvent();
  }

  swipe(direction: ObjectSliderCarouselDirection): void {
    if (this.carouselIsSliding) {
      return;
    }

    this.carouselIsSliding = true;
    this.$carousel.carousel(direction);
  }

  transformMarkersOnMobile(): void {
    if (this.document.body.clientWidth < 1036 && this.markers.length < 3) {
      const intermediate_array = [];
      for (const marker of this.markers[0]) {
        intermediate_array.push([marker]);
      }
      this.markers = intermediate_array;
    }
  }

  goToPreviousSlide(): void {
    this.swipe('prev');
  }

  goToNextSlide(): void {
    this.swipe('next');
  }

  private handleCarouselSlideEvent(): void {
    this.$carousel.on(CAROUSEL_DID_END_SLIDING, () => {
      this.carouselIsSliding = false;
    });
  }
}
