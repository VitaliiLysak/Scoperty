import { PropertyType } from '../../core/models/properties-repository.model';

export function getEstimatedPriceText(propertyType: PropertyType): string {
  return propertyType === PropertyType.MFH ? 'Schätzwerte' : 'Schätzwert';
}

export function getSalePriceText(propertyType: PropertyType): string {
  return propertyType === PropertyType.MFH ? 'Kaufpreise' : 'Kaufpreis';
}
