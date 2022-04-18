import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';

import {
  fromEvent,
  Observable,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from 'rxjs/operators';

import { WINDOW } from './window.provider';

export interface ScreenSize {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  readonly screenSize$: Observable<ScreenSize>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
  ) {
    const { clientWidth: initialWidth, clientHeight: initialHeight } = this.document.documentElement;
    this.screenSize$ = fromEvent(this.window, 'resize')
      .pipe(
        map((event: any) => {
          const { innerWidth: width, innerHeight: height } = event.target;
          return { width, height };
        }),
        startWith({ width: initialWidth, height: initialHeight }),
        debounceTime(300),
        distinctUntilChanged(),
        shareReplay(),
      );
  }
}
