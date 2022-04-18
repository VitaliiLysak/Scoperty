import {
  EmailFrequencyDto,
  PropertyTypeDto,
  PropertyStatusDto
} from './properties-repository.model';

export interface SearchAlert {
  uuid:             string;
  city:             string;
  emailFrequency:   EmailFrequencyDto;
  isActive:         boolean;
  livingAreaMin:    number;
  livingAreaMax:    number;
  name:             string;
  priceMin:         number;
  priceMax:         number;
  propertyTypes:    Array<PropertyTypeDto>;
  sellingStatuses:  Array<PropertyStatusDto>;
  editMode:         boolean;
  addressLine:      string;
  radius:           string;
}
