import { MILE_IN_KILOMETRES, MILE_IN_NAUTICAL, NAUTICAL_IN_MILE } from '../../app.constants';

type UnitType = 'K' | 'N';

export default function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: UnitType): number {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const radlon1 = Math.PI * lon1 / 180;
  const radlon2 = Math.PI * lon2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * NAUTICAL_IN_MILE;
  if (unit === 'K') { dist = dist * MILE_IN_KILOMETRES; }
  if (unit === 'N') { dist = dist * MILE_IN_NAUTICAL; }
  return dist;
}
