import { BehaviorSubject, Subject } from 'rxjs';

export interface FetchableBehaviorSubject<T> extends BehaviorSubject<T> {
  fetch: (options: any) => void;
}

export interface FetchableSubject<T> extends Subject<T> {
  fetch: (options: any) => void;
}
