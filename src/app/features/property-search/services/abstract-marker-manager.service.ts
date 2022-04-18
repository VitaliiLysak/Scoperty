import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';
import { Coordinates } from '../../../core/models/coordinates.model';
import { MAP_BOUNDS_CHANGED_DEBOUNCE, NARROWING_FACTOR } from '../../../app.constants';
import { GmapsUtils } from '../../../shared/utils/gmaps.util';
import { AbstractMarker } from '../../../core/models/abstract-marker';

export abstract class AbstractMarkerManager {

  currentZoomLevel: number;
  markerStorage: Map<number, Map<string, AbstractMarker>> = new Map();

  googleMap: google.maps.Map;
  onMarkerClick: (...args: any[]) => any;

  mapBoundsChanged$: Observable<void>;

  get mapZoom(): number {
    return this.googleMap.getZoom();
  }

  get mapBounds(): Coordinates {
    const bounds = this.googleMap.getBounds();
    if (bounds == null) throw new Error('Map not ready!');

    const neBound = bounds.getNorthEast();
    const swBound = bounds.getSouthWest();

    if (this.mapZoom <= 17) {
      return {
        nwLatitude: neBound.lat() - NARROWING_FACTOR,
        nwLongitude: swBound.lng() - NARROWING_FACTOR,
        seLatitude: swBound.lat() - NARROWING_FACTOR,
        seLongitude: neBound.lng() - NARROWING_FACTOR,
      };
    }

    return {
      nwLatitude: neBound.lat(),
      nwLongitude: swBound.lng(),
      seLatitude: swBound.lat(),
      seLongitude: neBound.lng(),
    };
  }

  protected constructor(
     public readonly SUPPORTED_ZOOM_LEVELS: ReadonlyArray<number> = []
  ) {
    this.SUPPORTED_ZOOM_LEVELS.map(
      zoomLevel => this.markerStorage.set(zoomLevel, new Map())
    );
  }

  init(
    googleMap: google.maps.Map,
    onMarkerClick: () => any,
    initialZoom: number,
  ) {
    this.googleMap = googleMap;
    this.onMarkerClick = onMarkerClick;
    this.mapBoundsChanged$ = GmapsUtils.observableFromEvent(googleMap, 'bounds_changed')
      .pipe(debounceTime(MAP_BOUNDS_CHANGED_DEBOUNCE));
    this.currentZoomLevel = initialZoom;
  }

  setZoomLevel(zoomLevel: number): void {
    if (zoomLevel === this.currentZoomLevel) {
      return;
    }
    this.hideMarkersFromZoomLevel(this.currentZoomLevel);
    this.showMarkersFromZoomLevel(zoomLevel);
    this.currentZoomLevel = zoomLevel;
  }

  abstract fetchMarkers(): void;

  pushMarkers(markers: AbstractMarker[]): void {
    markers.forEach(marker => this.pushMarker(marker));
  }

  showMarkersForCurrentZoomLevel(): void {
    this.showMarkersFromZoomLevel(this.currentZoomLevel);
  }

  hasMarker(identifier: string): boolean {
    return !isNullOrUndefined(
      this.SUPPORTED_ZOOM_LEVELS.find(
        zoomLevel => this.markerStorage.get(zoomLevel).has(identifier)
      )
    );
  }

  hideMarkersFromZoomLevel(zoomLevel: number): void {
    if (this.markerStorage.has(zoomLevel)) {
      this.markerStorage.get(zoomLevel).forEach(
        cluster => cluster.hide()
      );
    }
  }

  private pushMarker(marker: AbstractMarker): void {
    this.markerStorage.get(marker.zoomLevel).set(marker.identifier, marker);
  }

  private removeMarker(id: string): void {
    this.markerStorage.forEach(zoomStorage => {
      if (zoomStorage.has(id)) {
        zoomStorage.get(id).remove();
      }

      zoomStorage.delete(id);
    });
  }

  private removeMarkersFromZoomLevel(zoomLevel: number): void {
    if (this.markerStorage.has(zoomLevel)) {
      this.markerStorage.get(zoomLevel).forEach(
        cluster => cluster.remove()
      );
      this.markerStorage.get(zoomLevel).clear();
    }
  }

  private showMarkersFromZoomLevel(zoomLevel: number): void {
    if (this.markerStorage.has(zoomLevel)) {
      this.markerStorage.get(zoomLevel).forEach(
        cluster => cluster.show()
      );
    }
  }
}
