import { Coordinates } from '../../../core/models/coordinates.model';

export interface FiltersForm {
  sellingStatus: FiltersFormSellingStatus;
  propertyType: FiltersFormPropertyType;
  budget: FiltersFormRange;
  livingArea: FiltersFormRange;
}

export interface FiltersFormSellingStatus {
  forSale: boolean;
  makeMeMove: boolean;
}

export interface FiltersFormPropertyType {
  house: boolean;
  apartment: boolean;
}

export interface FiltersFormRange {
  min: string;
  max: string;
}

export interface FiltersPosition {
  zoom: number;
  coordinates: Coordinates;
}
