import {
  Component,
  Input, Output,
  EventEmitter,
  NgZone,
} from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';
import { cloneDeep } from 'lodash';

import {
  MarkerDetailGalleryViewWindowComponent,
  MarkerDetailGalleryViewWindowModel,
} from './marker-detail-gallery-view-window/marker-detail-gallery-view-window.component';
import { isMobileDevice } from '../../utils/responsive.util';
import { IImage } from '../../../core/models/image.model';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

@Component({
  selector: 'app-marker-detail-gallery',
  templateUrl: './marker-detail-gallery.component.html',
  styleUrls: ['./marker-detail-gallery.component.css'],
})
export class MarkerDetailGalleryComponent {
  @Input() model: ExtendedMarkerModel;
  @Input() mode: 'edit'|'show' = 'show';
  @Input() error: string;

  @Output() changeImageOrder = new EventEmitter<IImage>();
  @Output() uploadImage = new EventEmitter<any>();
  @Output() removeImages = new EventEmitter<Array<string>>();

  public selectedImages: Map<number, string> = new Map<number, string>();

  public isDragMode: boolean = false;

  public dragSupscription: any = null;
  public dropSupscription: any = null;

  public sortablejsOptions: any = {};

  oldImageOrders: IImage[];

  public get isMobileDevice() {
    return isMobileDevice();
  }

  public _name: string = 'marker-detail-gallery';

  private _prevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  constructor(
    private modalService: NgxModalStack,
    private _zone: NgZone,
  ) {
    this.sortablejsOptions = {
      animation: 150,
      onStart: () => {
        this._zone.run(() => void (this.isDragMode = true));
        this.oldImageOrders = cloneDeep(this.model.Images);
      },
      onEnd: (event) => void this._zone.run(() => {
        this.isDragMode = false;
        this.reorderImages(event.oldDraggableIndex, event.newDraggableIndex);
      })
    };
  }

  public toggleSelectImage(index: number): void {
    if (this.selectedImages.get(index)) {
      this.selectedImages.delete(index);
    } else {
      this.selectedImages.set(index, this.model.Images[index].id);
    }
  }

  public _removeImages($event) {
    const images = Array.from(this.selectedImages)
                        .map(([index, value]) => {
                          this.model.Images.splice(index, 1);
                          return value;
                        });
    this.selectedImages.clear();
    this.removeImages.emit(images);
  }

  public reorderImages(fromIndex: number, toIndex: number) {
    const newImagePlace = this.model.Images[toIndex];

    this.oldImageOrders
      .forEach((img, i) => {
        this.model.Images[i].order = img.order;
      });

    this.oldImageOrders = cloneDeep(this.model.Images);

    this.changeImageOrder.emit(newImagePlace);
  }

  public highlightOn(event) {
    this._prevent(event);
    event.target.classList.add('marker-detail-gallery__upload-drop-zone--state-active');
  }

  public highlightOff(event) {
    this._prevent(event);
    event.target.classList.remove('marker-detail-gallery__upload-drop-zone--state-active');
  }

  public uploadAreaOnDrop(event) {
    this.highlightOff(event);
    this._uploadImage(event.dataTransfer.files[0]);
  }

  public inputOnChange({target}) {
    this._uploadImage(target.files[0]);
  }

  public openSlideshow(index: number): void {
    const activeImageIndex = index;
    const images = this.model.images;
    const dialogModel: MarkerDetailGalleryViewWindowModel = {images, activeImageIndex};
    const modalRef = this.modalService.openFromComponent(MarkerDetailGalleryViewWindowComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public async _uploadImage(file) {
    const form = new FormData();
    form.append('image', file);
    this.uploadImage.emit(form);
  }
}
