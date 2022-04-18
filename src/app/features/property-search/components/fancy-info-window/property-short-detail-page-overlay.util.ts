import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

export interface PropertyShortDetailOverlayOptions {
  latlng: google.maps.LatLng;
  map: google.maps.Map;
  htmlElement: HTMLElement;
  detectChanges: () => void;
  offset?: { x: number; y: number; };
}

export interface PropertyShortDetailOverlay extends google.maps.OverlayView {
  updatePosition(latLng: google.maps.LatLng, offset: { x: number; y: number; }): void;
}

export const createPropertyShortDetailOverlay = (options: PropertyShortDetailOverlayOptions)  => {
  class PropertyShortDetailPageOverlay extends google.maps.OverlayView implements PropertyShortDetailOverlay {
    private latlng: google.maps.LatLng;
    private contentElement: HTMLElement;
    private wrapperElement: HTMLElement;
    private detectChangesCallback: () => void;
    private offset: { x: number; y: number; } = { x: 0, y: 0 };

    constructor({ map, latlng, htmlElement, offset, detectChanges }: PropertyShortDetailOverlayOptions) {
      super();
      this.latlng = latlng;
      this.contentElement = htmlElement;
      if (!isNullOrUndefined(detectChanges)) {
        this.detectChangesCallback = detectChanges;
      }
      this.setMap(map);
      if (!isNullOrUndefined(offset)) {
        this.offset = offset;
      }
    }

    onAdd(): void {
      this.createWrapper();
      this.initEventListeners();
      this.createContent();
      this.appendWrapperToOverlay();
    }

    draw(): void {
      this.updateWrapperPosition();
    }

    onRemove(): void {
      this.remove();
    }

    updatePosition(latLng: google.maps.LatLng, offset: { x: number; y: number; }): void {
      this.latlng = latLng;
      this.offset = offset;
      this.draw();
    }

    private remove(): void {
      if (!isNullOrUndefined(this.wrapperElement)) {
        this.wrapperElement.parentNode.removeChild(this.wrapperElement);
        this.wrapperElement = null;
      }
    }

    private createWrapper(): void {
      this.wrapperElement = document.createElement('div');
      this.wrapperElement.style.position = 'absolute';
      this.wrapperElement.style.zIndex = '1000';
    }

    private createContent(): void {
      if (!isNullOrUndefined(this.contentElement)) {
        this.wrapperElement.appendChild(this.contentElement);
      }
    }

    private initEventListeners(): void {
      google.maps.event.addDomListener(this.wrapperElement, 'click', event => {
        event.stopPropagation();
        if (!isNullOrUndefined(this.detectChangesCallback)) {
          setTimeout(this.detectChangesCallback);
        }
      });
      google.maps.event.addDomListener(this.wrapperElement, 'touchstart', event => {
        event.stopPropagation();
        if (!isNullOrUndefined(this.detectChangesCallback)) {
          setTimeout(this.detectChangesCallback);
        }
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
        this.wrapperElement.style.transform = 'translate(-50%, -100%)';
      }
    }
  }

  return new PropertyShortDetailPageOverlay(options);
};
