export abstract class AbstractMarker {
  abstract zoomLevel: number;
  abstract identifier: string;

  abstract markerPosition: google.maps.LatLng;

  abstract setOnClickHandler(callback: (...args) => void): void;

  abstract show(): void;

  abstract hide(): void;

  abstract remove(): void;
}
