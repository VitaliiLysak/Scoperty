import {
  isSmallMobileDevice,
  isMobileDevice,
  isTabletDevice,
  isTabletDeviceLandscaped,
  isLaptop,
  isLargeScreen,
  clientHeight,
  windowHeight,
} from './responsive.util';

describe('Responsive window functions', () => {

  it(`isSmallMobileDevice will check is it small mobile device`, () => {
    expect(isSmallMobileDevice())
      .toBe(
        window
          .matchMedia('only screen and (max-width: 450px),  only screen and (max-width: 736px) and (orientation: landscape) ')
          .matches
      );
  });

  it(`isMobileDevice will check is it mobile device`, () => {
    expect(isMobileDevice()).toBe(window.matchMedia('only screen and (max-width: 760px)').matches);
  });

  it(`isTabletDevice will check is it tablet device`, () => {
    expect(isTabletDevice()).toBe(window.matchMedia('only screen and (max-width: 991px)').matches);
  });

  it(`isTabletDeviceLandscaped will check was tablet device landscaped`, () => {
    expect(isTabletDeviceLandscaped()).toBe(window.matchMedia('only screen and (max-width: 1024px)').matches);
  });

  it(`isLaptop will check is it laptop`, () => {
    expect(isLaptop()).toBe(window.matchMedia('only screen and (max-width: 1280px)').matches);
  });

  it(`isLargeScreen will check is it large screen`, () => {
    expect(isLargeScreen()).toBe(window.matchMedia('only screen and (min-width: 1366px) and (min-height: 768px)').matches);
  });

  it(`clientHeight will be equal window.innerHeight or document.documentElement.clientHeight`, () => {
    expect(clientHeight()).toEqual(Math.max(window.innerHeight, document.documentElement.clientHeight));
  });

  it(`windowHeight will be equal window.innerHeight or document.documentElement.clientHeight`, () => {
    expect(windowHeight.value).toEqual(clientHeight());
  });
});
