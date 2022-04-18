import { isNullOrUndefined } from './null-or-undefined.util';

export interface MarkerHTMLOverlayOffset { x: number; y: number; }

export interface MarkerHTMLOverlayOptions {
  latlng: google.maps.LatLng;
  markerElement: HTMLElement;
  map?: google.maps.Map;
  offset?: MarkerHTMLOverlayOffset;
  classList?: Array<string>;
}

export interface MarkerHtmlOverlay extends google.maps.OverlayView {
  draw(): void;
  remove(): void;
  setClassList(classes: Array<string>): void;
  clearClassList (): void;
  addClass(className: string): void;
  removeClass(className: string): void;
  setOffset(offset: MarkerHTMLOverlayOffset): void;
}

export const createHTMLMapMarker = (opts: MarkerHTMLOverlayOptions)  => {
  class HtmlMarker extends google.maps.OverlayView implements MarkerHtmlOverlay {
    private latlng: google.maps.LatLng;
    private markerElement: HTMLElement;
    private wrapperElement: HTMLElement;
    private offset: { x: number; y: number; } = { x: 0, y: 0 };
    private classList: Array<string> = [];

    constructor({ map, latlng, markerElement, offset, classList }: MarkerHTMLOverlayOptions) {
      super();
      this.latlng = latlng;
      this.markerElement = markerElement;
      this.classList = classList;

      if (!isNullOrUndefined(map)) {
        this.setMap(map);
      }

      if (!isNullOrUndefined(offset)) {
        this.offset = offset;
      }

      if (!isNullOrUndefined(classList)) {
        this.classList = classList;
      }
    }

    draw(): void {
      if (isNullOrUndefined(this.wrapperElement)) {
        this.createWrapper();
        this.appendWrapperToOverlay();
      }
      this.updateWrapperPosition();
    }

    remove(): void {
      if (!isNullOrUndefined(this.wrapperElement)) {
        this.wrapperElement.parentNode.removeChild(this.wrapperElement);
        this.wrapperElement = null;
      }
    }

    addClass(className: string): void {
      this.markerElement.classList.add(className);
    }

    removeClass(className: string): void {
      this.markerElement.classList.remove(className);
    }

    setClassList(classes: Array<string>): void {
      this.clearClassList();
      if (!isNullOrUndefined(classes)) {
        classes.forEach(className => this.markerElement.classList.add(className));
      }
    }

    setOffset(offset: MarkerHTMLOverlayOffset): void {
      this.offset = offset;
      this.updateWrapperPosition();
    }

    clearClassList (): void {
      this.markerElement.classList.forEach(element => this.wrapperElement.classList.remove(element));
    }

    private createWrapper(): void {
      this.wrapperElement = document.createElement('div');
      this.wrapperElement.style.position = 'absolute';
      if (!isNullOrUndefined(this.markerElement)) {
        this.wrapperElement.appendChild(this.markerElement);
      }
      this.setClassList(this.classList);
      this.classList = null;
      this.initEventListeners();
    }

    private initEventListeners(): void {
      google.maps.event.addDomListener(this.wrapperElement, 'click', event => {
        event.stopPropagation();
        google.maps.event.trigger(this, 'click', event);
      });
      google.maps.event.addDomListener(this.wrapperElement, 'mouseover', event => {
        google.maps.event.trigger(this, 'mouseover', event);
      });
      google.maps.event.addDomListener(this.wrapperElement, 'mouseout', event => {
        google.maps.event.trigger(this, 'mouseout', event);
      });
    }

    private appendWrapperToOverlay(): void {
      this.getPanes().overlayMouseTarget.appendChild(this.wrapperElement);
    }

    private updateWrapperPosition(): void {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (!isNullOrUndefined(point)) {
        this.wrapperElement.style.left = `${point.x + this.offset.x}px`;
        this.wrapperElement.style.top = `${point.y + this.offset.y}px`;
      }
    }
  }

  return new HtmlMarker(opts);
};
