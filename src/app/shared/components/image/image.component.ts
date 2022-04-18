import {
  Component,
  Input,
  OnChanges,
  ElementRef,
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnChanges {

  @Input() src: string;
  @Input() defaultSrc: string;
  @Input() useThumbnail: boolean = false;
  @Input() mods: any = {};

  public name: string = 'image';
  public source: any;

  // @FIXME: later check the code below
  private _loadFromCache(src): any {
    if ((window as any).blobImages == null) (window as any).blobImages = {};
    if ((window as any).blobImages[src] != null) {
      return (window as any).blobImages[src];
    }
  }

  // @FIXME: later check the code below
  private _saveToCache(src, internalSrc): any {
    return (window as any).blobImages[src] = internalSrc;
  }

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private _ngEl: ElementRef,
  ) {}

  public ngOnChanges(): void {
    if (isNullOrUndefined(this.src)) this.source = this.defaultSrc || '/assets/images/pic.png';
    this.load();
  }

  public load(): void {
    if (this.src == null) return;
    this.source = this.src;
  }
}
