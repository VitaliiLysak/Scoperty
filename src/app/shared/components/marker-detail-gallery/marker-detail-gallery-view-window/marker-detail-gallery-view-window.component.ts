import {
  Component,
  OnInit,
} from '@angular/core';

import { NgxActiveModal } from 'ngx-multi-modal';
import { NguCarouselConfig } from '@ngu/carousel';

export interface MarkerDetailGalleryViewWindowModel {
  images: Array<string>;
  activeImageIndex: number;
}

@Component({
  selector: 'app-marker-detail-gallery-view-window',
  templateUrl: './marker-detail-gallery-view-window.component.html',
  styleUrls: ['./marker-detail-gallery-view-window.component.css']
})
export class MarkerDetailGalleryViewWindowComponent implements MarkerDetailGalleryViewWindowModel, OnInit {
  public carouselTile: NguCarouselConfig;

  public images: Array<string>;
  public activeImageIndex: number;

  public _name: string = 'marker-detail-gallery-view-window';

  constructor(
    private activeModal: NgxActiveModal,
  ) { }

  public ngOnInit(): void {
    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 3, lg: 5, all: 0 },
      slide: 1,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: false,
      },
      touch: false,
      easing: 'ease'
    };
  }

  public nextImage(): void {
    if (this.images == null || this.images.length < 2) return;
    ++this.activeImageIndex;
    if (this.activeImageIndex >= this.images.length) this.activeImageIndex = 0;
  }

  public prevImage(): void {
    if (this.images == null || this.images.length < 2) return;
    --this.activeImageIndex;
    if (this.activeImageIndex < 0) this.activeImageIndex = this.images.length - 1;
  }

  public changeIndex(index: number): void {
    this.activeImageIndex = index;
  }

  public close(): void {
    this.activeModal.close();
  }
}
