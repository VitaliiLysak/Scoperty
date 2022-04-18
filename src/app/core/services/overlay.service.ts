import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class OverlayService {
  public overlayStatus$: Subject<boolean> = new Subject<boolean>();

  public toggleOverlay(status: boolean): void {
    this.overlayStatus$.next(status);
  }
}
