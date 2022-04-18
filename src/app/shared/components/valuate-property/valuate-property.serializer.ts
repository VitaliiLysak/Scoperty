import { isEmptyString } from '../../utils/empty-string.util';
import { LivingAreaInputMask } from '../../utils/input-masks.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

import {
  ValuatePropertyForm,
  ValuateProperty,
} from './valuate-property.model';

export class ValuatePropertySerializer {
  static createValuateProperty(form: ValuatePropertyForm): ValuateProperty {
    const {
      livingArea: livingAreaString,
      constructionYear: constructionYearString,
    } = form;
    const livingArea = LivingAreaInputMask.unmaskValue(livingAreaString);
    const constructionYear = LivingAreaInputMask.unmaskValue(constructionYearString);

    return {
      livingArea,
      constructionYear,
    };
  }

  static createValuatePropertyForm(property: ExtendedMarkerModel): ValuatePropertyForm {
    const {
      LivingSurface: livingAreaNumber,
      ConstructionYear: constructionYearDateString,
    } = property;
    const livingArea = !isNullOrUndefined(livingAreaNumber) ? `${ livingAreaNumber }` : '';
    const [ constructionYear ] = !isEmptyString(constructionYearDateString) ? constructionYearDateString.split('-') : [ '' ];

    return {
      livingArea,
      constructionYear,
    };
  }
}
