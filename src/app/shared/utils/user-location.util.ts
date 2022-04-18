import { EMPTY, Observable } from 'rxjs';

export function requestUserLocation(): Observable<Coordinates> {
  if (!window.navigator || !window.navigator.geolocation) {
    return EMPTY;
  }

  return new Observable((subscriber) => {
    window.navigator.geolocation.getCurrentPosition(
      userLocation => {
        subscriber.next(userLocation.coords);
        subscriber.complete();
      }, error => {
        subscriber.error(error);
        subscriber.complete();
      });
  });
}
