import { Injectable } from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

// tslint:disable-next-line:max-line-length
import { MyPropertiesAskForSellingStatusChangeComponent } from '../components/my-properties-ask-for-selling-status-change/my-properties-ask-for-selling-status-change.component';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { PropertyStatus } from '../../../core/models/properties-repository.model';
import { ExtendedMarkerModelValidatorService } from '../../../core/services/extended-marker-model-validator.service';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

const SHOW_EVERY_NTH_TRIAL = 3;

@Injectable({
  providedIn: 'root',
})
export class AskForSellingStatusService {
  private propertyIdNumberOfTrialsMap: Map<string, number> = new Map<string, number>();

  constructor(
    private modalService: NgxModalStack,
    private markerValidatorService: ExtendedMarkerModelValidatorService,
  ) {
  }

  public askIfNecessary(marker: ExtendedMarkerModel): Promise<void> {
    const hasAtLeast50PercentOfData = this.markerValidatorService.hasAtLeast50PercentOfData(marker);
    const isMakeMeMoveOrForSale = this.isMakeMeMoveOrForSale(marker);

    if (hasAtLeast50PercentOfData && !isMakeMeMoveOrForSale) {
      const propertyId = marker.id;
      this.addNumberOfTrial(propertyId);
      if (!this.isExceedingNumberOfTrials(propertyId)) {
        return Promise.reject();
      }

      const modalRef = this.modalService.openFromComponent(MyPropertiesAskForSellingStatusChangeComponent);
      return modalRef.result
        .then((openForOffers: boolean) => {
          if (openForOffers) {
            marker.SellingStatus = PropertyStatus.MakeMeMove;
          }
        });
    }

    return Promise.reject();
  }

  private isMakeMeMoveOrForSale(marker: ExtendedMarkerModel): boolean {
    return marker.SellingStatus === PropertyStatus.MakeMeMove
      || marker.SellingStatus === PropertyStatus.ForSale;
  }

  private isExceedingNumberOfTrials(propertyId: string): boolean {
    const numberOfTrials = this.getNumberOfTrials(propertyId);
    const isExceeding = (numberOfTrials - 1) % SHOW_EVERY_NTH_TRIAL === 0;
    return isExceeding;
  }

  private addNumberOfTrial(propertyId: string): void {
    const numberOfTrials = this.getNumberOfTrials(propertyId) + 1;
    this.propertyIdNumberOfTrialsMap.set(propertyId, numberOfTrials);
  }

  private getNumberOfTrials(propertyId: string): number {
    const numberOfTrials = this.propertyIdNumberOfTrialsMap.get(propertyId);
    if (isNullOrUndefined(numberOfTrials)) {
      return 0;
    }

    return numberOfTrials;
  }
}
