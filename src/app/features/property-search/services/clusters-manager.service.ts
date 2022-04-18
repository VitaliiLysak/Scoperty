import { Inject, Injectable } from '@angular/core';

import { ClusterModel } from '../../../core/models/cluster.model';
import { AbstractMarkerManager } from './abstract-marker-manager.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { QueryOptions } from '../../../core/models/properties-repository.model';
import { map } from 'rxjs/operators';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { MAP_CLUSTERS_CONFIG } from '../../../main/main.constants';

const SUPPORTED_ZOOM_LEVELS: ReadonlyArray<number> = Object.freeze([7, 8, 9, 10, 11, 12, 13]);

@Injectable()
export class ClustersManagerService extends AbstractMarkerManager {

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    super(SUPPORTED_ZOOM_LEVELS);
  }

  init(
    googleMap: google.maps.Map,
    onMarkerClick: () => any,
    initialZoom: number,
  ) {
    super.init(googleMap, onMarkerClick, initialZoom);

    google.maps.event.addListenerOnce(this.googleMap, 'idle', () => {
      this.fetchMarkers();
    });

    this.mapBoundsChanged$.subscribe(() => this.fetchMarkers());
  }

  fetchMarkers() {
    if (this.mapZoom <= MAP_CLUSTERS_CONFIG.maxZoom) {
      const options: QueryOptions = {
        coordinates: this.mapBounds,
        zoom: this.mapZoom
      };
      this.propertiesRepositoryService.getClustersGeo(options)
        .pipe(
          map(clustersData => clustersData.features
            .filter(feature => !this.hasMarker(
              ClusterModel.createIdentifier(feature)
            ))
            .map(feature => {
              const cluster = new ClusterModel(feature);
              cluster.setMap(this.googleMap);
              cluster.setOnClickHandler(event => this.onMarkerClick(event, cluster));
              return cluster;
            })
          )
        )
        .subscribe(
          clusters => {
            this.pushMarkers(clusters);
            this.showMarkersForCurrentZoomLevel();
          },
          error => this.logger.error('ClusterManagerService::fetchMarkers:error', error)
        );
    }
  }
}
