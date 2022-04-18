import { Pipe, PipeTransform } from '@angular/core';

import { PropertyTypeDto } from '../../core/models/properties-repository.model';

import { templatePropertyTypeToFrontend } from '../utils/deserializator.util';

@Pipe({
  name: 'propertyTypes',
})
export class PropertyTypesPipe implements PipeTransform {
  transform(propertyTypes: Array<PropertyTypeDto>): string {
    return propertyTypes.map(propertyType => templatePropertyTypeToFrontend(propertyType)).join(', ');
  }
}
