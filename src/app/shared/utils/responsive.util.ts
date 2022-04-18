import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

export const mediaQueryMatches = (mediaQuery: string): boolean => {
  return window.matchMedia(mediaQuery).matches;
};

export const widthSmallerThan = (px: number): boolean => {
  return mediaQueryMatches(`only screen and (max-width: ${px}px)`);
};

export const clientHeight = (): number => {
  return Math.max(window.innerHeight, document.documentElement.clientHeight);
};

export const windowHeight: {value: number} = {value: clientHeight()};

export const windowResize$ = fromEvent(window, 'resize');
export const debouncedWindowResize$ = windowResize$.pipe(debounceTime(100));

/*
 * isSmallDevice$
 */
const isSmallDeviceMedia = (): boolean => {
  return mediaQueryMatches('(max-width: 576px)');
};
const isSmallDeviceBS = new BehaviorSubject(isSmallDeviceMedia());
export const isSmallDevice$ = isSmallDeviceBS.asObservable();
export const isSmallDevice = () => isSmallDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isSmallDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isSmallDeviceBS.next(val));

/*
 * isMobileDevice$
 */
const isMobileDeviceMedia = (): boolean => {
  return mediaQueryMatches('only screen and (max-width: 760px)');
};
const isMobileDeviceBS = new BehaviorSubject(isMobileDeviceMedia());
export const isMobileDevice$ = isMobileDeviceBS.asObservable();
export const isMobileDevice = () => isMobileDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isMobileDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isMobileDeviceBS.next(val));

/*
 * isSmallMobileDevice$
 */
const isSmallMobileDeviceMedia = (): boolean => {
  return mediaQueryMatches('only screen and (max-width: 450px),  only screen and (max-width: 736px) and (orientation: landscape) ');
};
const isSmallMobileDeviceBS = new BehaviorSubject(isSmallMobileDeviceMedia());
export const isSmallMobileDevice$ = isSmallMobileDeviceBS.asObservable();
export const isSmallMobileDevice = () => isSmallMobileDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isSmallMobileDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isSmallMobileDeviceBS.next(val));

/*
 * isSmallMobileDevice$
 */
const isMobileMediumDeviceMedia = (): boolean => {
  return mediaQueryMatches('(max-width: 768px)');
};
const isMobileMediumDeviceBS = new BehaviorSubject(isMobileMediumDeviceMedia());
export const isMobileMediumDevice$ = isMobileMediumDeviceBS.asObservable();
export const isMobileMediumDevice = () => isMobileMediumDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isMobileMediumDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isMobileMediumDeviceBS.next(val));

/*
 * isMediumDevice$
 */
const isMediumDeviceMedia = (): boolean => {
  return mediaQueryMatches('(max-width: 670px)');
};
const isMediumDeviceBS = new BehaviorSubject(isMediumDeviceMedia());
export const isMediumDevice$ = isMediumDeviceBS.asObservable();
export const isMediumDevice = () => isMediumDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isMediumDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isMediumDeviceBS.next(val));

/*
 * isTabletDevice$
 */
const isTabletDeviceMedia = (): boolean => {
  return mediaQueryMatches('only screen and (max-width: 991px)');
};
const isTabletDeviceBS = new BehaviorSubject(isTabletDeviceMedia());
export const isTabletDevice$ = isTabletDeviceBS.asObservable();
export const isTabletDevice = () => isTabletDeviceBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isTabletDeviceMedia()),
    distinctUntilChanged()
  ).subscribe(val => isTabletDeviceBS.next(val));

/*
 * isTabletDeviceLandscaped$
 */
const isTabletDeviceLandscapedMedia = (): boolean => {
  return mediaQueryMatches('only screen and (max-width: 1120px)');
};
const isTabletDeviceLandscapedBS = new BehaviorSubject(isTabletDeviceLandscapedMedia());
export const isTabletDeviceLandscaped$ = isTabletDeviceLandscapedBS.asObservable();
export const isTabletDeviceLandscaped = () => isTabletDeviceLandscapedBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isTabletDeviceLandscapedMedia()),
    distinctUntilChanged()
  ).subscribe(val => isTabletDeviceLandscapedBS.next(val));

/*
 * isLaptop$
 */
const isLaptopMedia = (): boolean => {
  return mediaQueryMatches('only screen and (max-width: 1280px)');
};
const isLaptopBS = new BehaviorSubject(isLaptopMedia());
export const isLaptop$ = isLaptopBS.asObservable();
export const isLaptop = () => isLaptopBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isLaptopMedia()),
    distinctUntilChanged()
  ).subscribe(val => isLaptopBS.next(val));

/*
 * isLargeScreen$
 */
const isLargeScreenMedia = (): boolean => {
  return mediaQueryMatches('only screen and (min-width: 1366px) and (min-height: 768px)');
};
const isLargeScreenBS = new BehaviorSubject(isLargeScreenMedia());
export const isLargeScreen$ = isLargeScreenBS.asObservable();
export const isLargeScreen = () => isLargeScreenBS.value;

debouncedWindowResize$
  .pipe(
    map(() => isLargeScreenMedia()),
    distinctUntilChanged()
  ).subscribe(val => isLargeScreenBS.next(val));


window.addEventListener('resize', () => windowHeight.value = clientHeight());
