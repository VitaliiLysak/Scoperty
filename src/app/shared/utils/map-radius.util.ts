const km = 1000;

interface IncrementSchema {
  from: number;
  to: number;
  increment: number;
}

export interface ZoomAndRadius {
  zoom: number;
  radiusPx: number;
  radius?: number;
}

const incrementSchemasDefault: IncrementSchema[] = [
  {from: -Infinity, to: 100, increment: 0},
  {from: 100, to: 1000, increment: 100},
  {from: km, to: 10 * km, increment: km},
  {from: 10 * km, to: 20 * km, increment: 2 * km},
  {from: 20 * km, to: 50 * km, increment: 5 * km},
  {from: 50 * km, to: 100 * km, increment: 10 * km},
  {from: 100 * km, to: 1000 * km, increment: 20 * km},
  {from: 1000 * km, to: Infinity, increment: 0},
];

const incrementSchemasSmaller: IncrementSchema[] = [
  {from: -Infinity, to: 100, increment: 0},
  {from: 100, to: 1000, increment: 100},
  {from: km, to: 10 * km, increment: km},
  {from: 10 * km, to: 20 * km, increment: 2 * km},
  {from: 20 * km, to: 50 * km, increment: 5 * km},
  {from: 50 * km, to: 100 * km, increment: 10 * km},
  {from: 100 * km, to: Infinity, increment: 0},
];

export function customSchemeIncrementRadiusGenerator(incrementSchemas: IncrementSchema[]) {
  return (radius: number): number =>
    radius + incrementSchemas.find(step => radius >= step.from && radius < step.to).increment;
}

export const incrementRadius = customSchemeIncrementRadiusGenerator(incrementSchemasDefault);
export const incrementRadiusInSmallerScheme = customSchemeIncrementRadiusGenerator(incrementSchemasSmaller);

export function customSchemeDecrementRadiusGenerator(incrementSchemas: IncrementSchema[]) {
  return (radius: number): number => {
    if (radius === incrementSchemas[incrementSchemas.length - 1].from) {
      return radius - incrementSchemas[incrementSchemas.length - 2].increment;
    }

    return radius - incrementSchemas.find(step => radius > step.from && radius <= step.to).increment;
  };
}
export const decrementRadius = customSchemeDecrementRadiusGenerator(incrementSchemasDefault);
export const decrementRadiusInSmallerScheme = customSchemeDecrementRadiusGenerator(incrementSchemasSmaller);

export function customSchemeFloorRadiusGenerator(incrementSchemas: IncrementSchema[]) {
  return (radius: number): number => {
    const increment = incrementSchemas.find(step => radius >= step.from && radius < step.to).increment;

    if (increment === 0) {
      if (radius < 10 * km) {
        return incrementSchemas[0].to;
      } else {
        return incrementSchemas[incrementSchemas.length - 1].from;
      }
    }

    return radius - (radius % increment);
  };
}

export const floorRadius = customSchemeFloorRadiusGenerator(incrementSchemasDefault);
export const floorRadiusInSmallerScheme = customSchemeFloorRadiusGenerator(incrementSchemasSmaller);

export function metersPerPx(lat: number, zoom: number): number {
  return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
}

export function bestZoomLevelForRadius(radius: number, lat: number, mapSize: number, padding: number): ZoomAndRadius {
  return new Array(19)
    .fill(0)
    .map((_, zoom) => ({
      zoom,
      radiusPx: radius / metersPerPx(lat, zoom),
      radius
    }))
    .filter(zoomAndRadius => (zoomAndRadius.radiusPx + padding) * 2 < mapSize)
    .sort((a, b) => a.radiusPx - b.radiusPx)
    .pop();
}

export function customSchemeBestRadiusForZoomLevelGenerator(floorRadiusFunction: (a: number) => number) {
  return (zoom: number, lat: number, mapSize: number, padding: number): ZoomAndRadius => {
    const localMetersPerPx = metersPerPx(lat, zoom);

    const availableSpace = localMetersPerPx * (mapSize - padding) / 2;

    const fittedRadius = floorRadius(availableSpace);

    return {
      zoom,
      radius: fittedRadius,
      radiusPx:  fittedRadius / localMetersPerPx
    };
  };
}

export const bestRadiusForZoomLevel = customSchemeBestRadiusForZoomLevelGenerator(floorRadius);
export const bestRadiusForZoomLevelInSmallerScheme =
  customSchemeBestRadiusForZoomLevelGenerator(floorRadiusInSmallerScheme);
