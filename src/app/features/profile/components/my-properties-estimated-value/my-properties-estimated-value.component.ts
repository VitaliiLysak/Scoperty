import { Component, Input, } from '@angular/core';

import { MyPropertiesService, MyPropertiesTabs } from '../../services/my-properties.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-my-properties-estimated-value',
  templateUrl: './my-properties-estimated-value.component.html',
  styleUrls: [
    './my-properties-estimated-value.component.css',
  ],
})
export class MyPropertiesEstimatedValueComponent {
  @Input() property: ExtendedMarkerModel;

  _name: string = 'my-properties-estimated-value';

  linkToSearchBrokerPage: string[] = [ `/${ SHARED_ROUTES_NAMES.SEARCHBROKER }` ];

  get valuatePropertyButtonStretch(): boolean {
    return isSmallMobileDevice();
  }

  get valuatePropertyButtonLabel(): string {
    return isSmallMobileDevice() ? 'Schätzwert verbessern' : 'Verbessere deinen Schätzwert';
  }

  constructor(private myPropertiesService: MyPropertiesService) {
  }

  improveEstimatedValue(): void {
    this.myPropertiesService.setActiveTab(MyPropertiesTabs.Edit);
  }
}
