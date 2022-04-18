import {
  Inject,
  Injectable,
} from '@angular/core';

import { ExtendedMarkerModel } from '../models/extended-marker.model';
import { isEmptyArray } from '../../shared/utils/empty-array.util';
import { isEmptyBoolean } from '../../shared/utils/empty-boolean.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';
import { roundPercent } from '../../shared/utils/round-percent.util';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';

const EXISTING_DATA_50_PERCENT = 0.5;
const NUMBER_OF_PROPERTIES_TO_VALIDATE = 17;

@Injectable()
export class ExtendedMarkerModelValidatorService {
  constructor(@Inject(LOGGER) private logger: LoggerService) {
  }

  public hasAtLeast50PercentOfData(model: ExtendedMarkerModel): boolean {
    const numberOfExistingDataInPercent = this.getNumberOfExistingDataInPercent(model);
    this.logger.info('ExtendedMarkerModelValidatorService::numberOfDataInPercent', numberOfExistingDataInPercent);
    return numberOfExistingDataInPercent >= EXISTING_DATA_50_PERCENT;
  }

  public getNumberOfExistingDataInPercent(model: ExtendedMarkerModel): number {
    let numberOfNonEmptyProperties = 0;
    if (model.LivingSurface > 0) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.ConstructionYear)) {
      numberOfNonEmptyProperties++;
    }
    if (model.RoomsNumber > 0) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyArray(model.Images)) {
      numberOfNonEmptyProperties++;
    }
    if (this.hasEquipmentData(model)) {
      numberOfNonEmptyProperties++;
    }
    if (model.TotalArea > 0) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.LastModernisationYear)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.PropertyCondition)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.PropertySubType)) {
      numberOfNonEmptyProperties++;
    }
    if (model.Floor > 0) {
      numberOfNonEmptyProperties++;
    }
    if (model.FloorNumber > 0) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyBoolean(model.Rented)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyBoolean(model.OldProperty)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyBoolean(model.LeaseHold)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyBoolean(model.HistoricalProperty)) {
      numberOfNonEmptyProperties++;
    }
    if (this.hasDescriptionData(model)) {
      numberOfNonEmptyProperties++;
    }
    if (this.hasEnergyCertificateData(model)) {
      numberOfNonEmptyProperties++;
    }

    const percentOfNonEmptyProperties = numberOfNonEmptyProperties / NUMBER_OF_PROPERTIES_TO_VALIDATE;
    return roundPercent(percentOfNonEmptyProperties);
  }

  private hasEquipmentData(model: ExtendedMarkerModel): boolean {
    let numberOfNonEmptyProperties = 0;
    if (model.Garden) {
      numberOfNonEmptyProperties++;
    }
    if (model.VisitorsWC) {
      numberOfNonEmptyProperties++;
    }
    if (model.Cellar) {
      numberOfNonEmptyProperties++;
    }
    if (model.HistoricalProperty) {
      numberOfNonEmptyProperties++;
    }
    if (model.SecondaryEntrance) {
      numberOfNonEmptyProperties++;
    }
    if (model.BarrierFree) {
      numberOfNonEmptyProperties++;
    }
    if (model.Furnished) {
      numberOfNonEmptyProperties++;
    }
    if (model.BikeRoom) {
      numberOfNonEmptyProperties++;
    }
    if (model.HasDryWashSpace) {
      numberOfNonEmptyProperties++;
    }
    if (model.SwimmingPool) {
      numberOfNonEmptyProperties++;
    }
    if (model.Sauna) {
      numberOfNonEmptyProperties++;
    }
    if (model.AirConditioned) {
      numberOfNonEmptyProperties++;
    }
    if (model.Chimney) {
      numberOfNonEmptyProperties++;
    }
    if (model.Balcony) {
      numberOfNonEmptyProperties++;
    }
    if (model.Terrace) {
      numberOfNonEmptyProperties++;
    }
    if (model.Parking) {
      numberOfNonEmptyProperties++;
    }
    if (model.Garage) {
      numberOfNonEmptyProperties++;
    }
    if (model.Elevator) {
      numberOfNonEmptyProperties++;
    }
    if (model.Kitchen) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.RoofCovering)) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.Windows)) {
      numberOfNonEmptyProperties++;
    }

    return numberOfNonEmptyProperties >= 1;
  }

  private hasDescriptionData(model: ExtendedMarkerModel): boolean {
    let numberOfNonEmptyProperties = 0;
    if (model.Title) {
      numberOfNonEmptyProperties++;
    }
    if (model.Description) {
      numberOfNonEmptyProperties++;
    }

    return numberOfNonEmptyProperties >= 1;
  }

  private hasEnergyCertificateData(model: ExtendedMarkerModel): boolean {
    let numberOfNonEmptyProperties = 0;
    if (model.EnergyCertificateStatus) {
      numberOfNonEmptyProperties++;
    }
    if (model.EnergyCertificateType) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyString(model.EnergyCertificateDate)) {
      numberOfNonEmptyProperties++;
    }
    if (model.EnergyConsumptionClass) {
      numberOfNonEmptyProperties++;
    }
    if (model.EnergySource) {
      numberOfNonEmptyProperties++;
    }
    if (model.FacilitiesQuality) {
      numberOfNonEmptyProperties++;
    }
    if (model.HeatingType) {
      numberOfNonEmptyProperties++;
    }
    if (model.EnergyCertificateFileId) {
      numberOfNonEmptyProperties++;
    }
    if (model.EnergyCertificateValue > 0) {
      numberOfNonEmptyProperties++;
    }
    if (!isEmptyBoolean(model.WaterHeatingIncluded)) {
      numberOfNonEmptyProperties++;
    }

    return numberOfNonEmptyProperties >= 3;
  }
}
