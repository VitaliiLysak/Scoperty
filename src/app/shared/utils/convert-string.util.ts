import { isEmptyString } from './empty-string.util';

export function convertStringToInt(value: string, fallbackValue: number = 0): number {
  if (isEmptyString(value)) {
    return fallbackValue;
  }

  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) {
    return fallbackValue;
  }

  return number;
}
