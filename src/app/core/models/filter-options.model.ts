import { SellingStatus } from '../../app.constants';
import { PropertyType } from '../../core/models/properties-repository.model';

export interface FilterOptions {
  PropertyType:         PropertyType;
  PriceFrom:            number;
  PriceTo:              number;
  PriceDevelopmentFrom: number;
  PriceDevelopmentTo:   number;
  AreaSize:             number;
  AreaSize2:            number;
  SellingStatus: SellingStatus;
}
