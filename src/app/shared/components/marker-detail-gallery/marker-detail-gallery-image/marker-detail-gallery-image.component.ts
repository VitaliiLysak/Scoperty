import {
  Component,
  Input, Output,
  OnChanges, OnInit, OnDestroy,
  EventEmitter,
  ElementRef,
} from '@angular/core';

import { debounce } from 'lodash';

import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-marker-detail-gallery-image',
  templateUrl: './marker-detail-gallery-image.component.html',
  styleUrls: ['./marker-detail-gallery-image.component.css']
})

export class MarkerDetailGalleryImageComponent implements OnChanges, OnInit, OnDestroy {
  @Input() src: string;
  @Input() useThumbnail: boolean = false;
  @Input() mods: any = {};

  @Output() toggleSelectImage: EventEmitter<null> = new EventEmitter<null>();
  @Output() click: EventEmitter<null> = new EventEmitter<null>();

  public _src: any;
  public _name: string = 'marker-detail-gallery-image';

  public isHovered: boolean = false;
  public isActive: boolean = false;
  public isDragged: boolean = false;

  private _selectImage() {
    if (this.mods.state === 'edit') {
      this.isActive = !this.isActive;
      this.toggleSelectImage.emit();
    }
  }

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private _ngEl: ElementRef,
  ) {
    this.onHoverIn = debounce(this.onHoverIn.bind(this), 100);
    this.onHoverOut = debounce(this.onHoverOut.bind(this), 100);
  }

  public _click(event) {
    // this.click.emit();
    // if (this.mods.state === 'edit') {
    //   this.isActive = !this.isActive;
    //   this.toggleSelectImage.emit();
    // }
  }

  public ngOnChanges() {
    if (this.mods.canHover) {
      this._ngEl.nativeElement.classList.add('marker-detail-gallery-image--with-hover');
    } else {
      this._ngEl.nativeElement.classList.remove('marker-detail-gallery-image--with-hover');
    }
    if (this.mods.state === 'edit') {
      this._ngEl.nativeElement.classList.add('marker-detail-gallery-image--state-edit');
    } else {
      this._ngEl.nativeElement.classList.remove('marker-detail-gallery-image--state-edit');
    }
    this.load();
  }

  public ngOnInit() {
    this._ngEl.nativeElement.addEventListener('mouseenter', this.onHoverIn);
    this._ngEl.nativeElement.addEventListener('mouseleave', this.onHoverOut);
  }

  public ngOnDestroy() {
    this._ngEl.nativeElement.removeEventListener('mouseenter', this.onHoverIn);
    this._ngEl.nativeElement.removeEventListener('mouseleave', this.onHoverOut);
  }

  public onHoverIn() {
    this.isHovered = true;
  }

  public onHoverOut() {
    this.isHovered = false;
  }

  public async load() {
   /* const src = `${this.src}${this.useThumbnail ? '/thumbnail' : ''}`;
    if ((window as any).blobImages == null) (window as any).blobImages = {};
    if ((window as any).blobImages[src] != null) {
      this._src = (window as any).blobImages[src];
    } else {
      let headers = new HttpHeaders();
      headers = headers.append('accept', 'image/png');
      headers = headers.append('content-type', 'image/png');
      const response = await this.httpClient.get(src, {headers, responseType: 'blob'}).toPromise();
      (window as any).blobImages[src] = this._src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
    }*/
   this._src = this.src;
  }
}
