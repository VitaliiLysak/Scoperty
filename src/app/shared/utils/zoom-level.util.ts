import { ZOOM_CONSTANTS } from '../../main/main.constants';
import { ZoomLevel } from '../../core/models/location.model';

export default function calculateZoomLevel(zoom: number): ZoomLevel {
  if (ZOOM_CONSTANTS.LEVELS.HIGH.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.HIGH.UP_EDGE) {
    // @FIXME: zoom only for large screen

    /*if ((ZOOM_CONSTANTS.LEVELS.HIGH.DOWN_EDGE + 1) === zoom && isLargeScreen()) {
      return 'BELOW_NEIGHBOURHOOD';
    }*/
    return 'HIGH';
  } else if (ZOOM_CONSTANTS.LEVELS.BELOW_NEIGHBOURHOOD.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.BELOW_NEIGHBOURHOOD.UP_EDGE) {
    return 'BELOW_NEIGHBOURHOOD';
  } else if (ZOOM_CONSTANTS.LEVELS.NEIGHBOURHOOD.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.NEIGHBOURHOOD.UP_EDGE) {
    return 'NEIGHBOURHOOD';
  } else if (ZOOM_CONSTANTS.LEVELS.LOCALITY.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.LOCALITY.UP_EDGE) {
    return 'LOCALITY';
  } else if (ZOOM_CONSTANTS.LEVELS.COUNTY.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.COUNTY.UP_EDGE) {
    return 'COUNTY';
  } else if (ZOOM_CONSTANTS.LEVELS.STATE.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.STATE.UP_EDGE) {
    return 'STATE';
  } else if (ZOOM_CONSTANTS.LEVELS.COUNTRY.DOWN_EDGE < zoom && zoom <= ZOOM_CONSTANTS.LEVELS.COUNTRY.UP_EDGE) {
    return 'COUNTRY';
  } else {
    return 'NEIGHBOURHOOD';
  }
}
