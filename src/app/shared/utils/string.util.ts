import { isEmptyString } from './empty-string.util';

export function cleanFormattedAmountString(value: string): string {
  if (isEmptyString(value)) {
    return value;
  }

  return value
    .replace(' €', '')
    .replace(/\./g, '');
}

export function cleanFormattedLivingAreaString(value: string): string {
  if (isEmptyString(value)) {
    return value;
  }

  return value.replace(/\./g, '');
}
