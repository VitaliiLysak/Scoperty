import { ExtendedMarkerModel } from '../../core/models/extended-marker.model';

export function splitMarkersIntoGroups(markers): Array<Array<ExtendedMarkerModel>> {
  const subArrayOfMarkers: Array<Array<ExtendedMarkerModel>> = [];
  for (let i = 0; i < Math.floor(markers.length / 3); i++) {
    subArrayOfMarkers[i] = markers.slice((i * 3), (i * 3) + 3);
  }
  return subArrayOfMarkers;
}
