import { Location } from '@angular/common';
import { Component, Input, } from '@angular/core';

import { isSmallMobileDevice } from '../../utils/responsive.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { ExtendedMarkerModelValidatorService } from '../../../core/services/extended-marker-model-validator.service';
import { StyleGuide } from '../../../styles/style-guide';

const PI = 3.14;
const GAUGE_MAX = 0.38;
const GAUGE_RADIUS = 138;
const GAUGE_RADIUS_MOBILE = GAUGE_RADIUS - 15;
const GAUGE_PROGRESS_STROKE_WIDTH = 22;
const GAUGE_BACKGROUND_STROKE_WIDTH = 14;
const DEFAULT_DATA_IN_PERCENT = 0.28;
const DEFAULT_ESTIMATED_PRICE = 0;

const GaugeColor = {
  BackgroundStart: StyleGuide.brandLightBlueLightColor,
  BackgroundEnd: StyleGuide.gaugeBackgroundColor1,
  ProgressStart: StyleGuide.brandDarkGreenColor,
  ProgressEnd: StyleGuide.secondaryCTAHoverColor,
};

@Component({
  selector: 'app-valuate-property-gauge',
  templateUrl: './valuate-property-gauge.component.html',
  styleUrls: [
    './valuate-property-gauge.component.css',
  ],
})
export class ValuatePropertyGaugeComponent {
  @Input() property: ExtendedMarkerModel;

  name: string = 'valuate-property-gauge';

  Color: typeof GaugeColor = GaugeColor;

  get size(): number {
    return isSmallMobileDevice() ? GAUGE_RADIUS_MOBILE * 2 : GAUGE_RADIUS * 2;
  }

  get gaugeCircumference(): number {
    return 2 * GAUGE_RADIUS * PI;
  }

  get gaugeRadius(): number {
    return isSmallMobileDevice() ? GAUGE_RADIUS_MOBILE : GAUGE_RADIUS;
  }

  get gaugeCircleRadius(): number {
    return this.gaugeRadius - (this.maxStrokeWidth / 2);
  }

  get gaugeTransform(): string {
    const transformRadius = this.gaugeRadius + (this.maxStrokeWidth / 2);

    return `rotate(${ transformRadius } ${ this.gaugeRadius }, ${ this.gaugeRadius })`;
  }

  get backgroundStrokeWidth(): number {
    return GAUGE_BACKGROUND_STROKE_WIDTH;
  }

  get backgroundCircumference(): number {
    return this.gaugeCircumference * GAUGE_MAX;
  }

  get backgroundGradientUrl(): string {
    return `url(${ this.svgBaseUrl }#background-gradient)`;
  }

  get progressStrokeWidth(): number {
    return GAUGE_PROGRESS_STROKE_WIDTH;
  }

  get progressCircumference(): number {
    const gaugeAvailable = 1 - GAUGE_MAX;
    const gaugeProgressCircumference = (1 - this.dataInPercent) * gaugeAvailable + GAUGE_MAX;

    return this.gaugeCircumference * gaugeProgressCircumference;
  }

  get progressGradientUrl(): string {
    return `url(${ this.svgBaseUrl }#progress-gradient)`;
  }

  get estimatedPrice(): number {
    if (isNullOrUndefined(this.property)) {
      return DEFAULT_ESTIMATED_PRICE;
    }

    return this.property.EstimatedPrice;
  }

  get dataInPercent(): number {
    if (isNullOrUndefined(this.property)) {
      return DEFAULT_DATA_IN_PERCENT;
    }

    const precision = this.extendedMarkerModelValidatorService.getNumberOfExistingDataInPercent(this.property);
    return (precision * 100) < 1 ? DEFAULT_DATA_IN_PERCENT : precision;
  }

  private get svgBaseUrl(): string {
    return this.location.path(false);
  }

  private get maxStrokeWidth(): number {
    return Math.max(this.progressStrokeWidth, this.backgroundStrokeWidth);
  }

  constructor(
    private location: Location,
    private extendedMarkerModelValidatorService: ExtendedMarkerModelValidatorService,
  ) {
  }
}
