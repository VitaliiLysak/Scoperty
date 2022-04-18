import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, Output, } from '@angular/core';

import * as moment from 'moment';
import * as Chart from 'chart.js';

import { PriceTrend, PriceTrendObj, PriceTrends } from '../../../core/models/marker-price-trend.model';
import { StateManagerService } from '../../../core/services/state-manager.service';
import { StyleGuide } from '../../../styles/style-guide';
import { isSmallMobileDevice } from '../../../shared/utils/responsive.util';

// @FIXME: later should evaluate year-borders dynamically
// +\- DELTA should be specified
const BORDER_YEAR = Number((new Date()).getFullYear());
const FROM_YEAR   = BORDER_YEAR - 3;
const TO_YEAR     = BORDER_YEAR + 1;

const CHART_FONT_FAMILY = StyleGuide.fontFamily;
const CHART_FONT_SIZE = '12';
const CHART_FONT_WEIGHT = 'bold';
const CHART_LINE_HEIGHT = '16px';
const CHART_LETTER_SPACING = 0.7;

const CHART_COLOR_TREND = StyleGuide.brandLightBlueColor;
const CHART_COLOR_TREND_CITY = StyleGuide.neutralsDarkLightColor;
const CHART_BACKGROUND_COLOR = StyleGuide.neutralsLightExtremeColor;
const CHART_TEXT_COLOR = StyleGuide.brandDarkGreenColor;
const CHART_INTERSECTION_POINT = StyleGuide.brandGreenBlueColor;
const CHART_X_AXES_GRID_LINES_COLOR = StyleGuide.neutralsDarkMiddleColor;
const CHART_Y_AXES_GRID_LINES_COLOR = StyleGuide.neutralsMiddleLightColor;
const CHART_TOOLTIP_BACKGROUND_COLOR = StyleGuide.highlighting1Color;

enum PriceTrendType {
  Trend,
  TrendCity,
}

interface ViewSize {
  isLarge?: boolean;
}

interface ChartColors {
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBorderColor: string;
  pointHoverBackgroundColor: string;
  borderWidth: number;
  pointBorderWidth: number;
}

const CHART_COLORS_PRICE_TREND: ChartColors = {
  backgroundColor: 'transparent',
  borderColor: CHART_COLOR_TREND,

  pointBackgroundColor: CHART_BACKGROUND_COLOR,
  pointBorderColor: CHART_COLOR_TREND,

  pointHoverBorderColor: CHART_COLOR_TREND,
  pointHoverBackgroundColor: CHART_BACKGROUND_COLOR,

  borderWidth: 1,
  pointBorderWidth: 2,
};

const CHART_COLORS_PRICE_TREND_CITY: ChartColors = {
  backgroundColor: 'transparent',
  borderColor: CHART_COLOR_TREND_CITY,

  pointBackgroundColor: CHART_BACKGROUND_COLOR,
  pointBorderColor: CHART_COLOR_TREND_CITY,

  pointHoverBorderColor: CHART_COLOR_TREND_CITY,
  pointHoverBackgroundColor: CHART_BACKGROUND_COLOR,

  borderWidth: 1,
  pointBorderWidth: 2,
};

@Component({
  selector: 'app-marker-detail-estimated-price-trend',
  templateUrl: './marker-detail-estimated-price-trend.component.html',
  styleUrls: ['./marker-detail-estimated-price-trend.component.css']
})
export class MarkerDetailEstimatedPriceTrendComponent implements OnChanges, AfterViewChecked {
  @Input() isLoading: boolean;
  @Input() priceTrends: PriceTrends;
  @Input() userNotAuthorized: boolean;
  @Input() viewSize: ViewSize = {};

  @Output() showSignup: EventEmitter<string> = new EventEmitter<string>();

  public chartDataSets: any[] = [];
  public chartOptions: { [options: string]: any } = {};

  public pointPrice: number;
  public pointYear: Date;
  public pointQuarter: string;
  public pointDiffPercent: number;

  public blurBlockOptions: { [ option: string ]: string } = {
    width: '0px',
    height: '0px',
  };
  public coverText: string = 'Erfahre jetzt die Prognose für die Schätzwerte im nächsten Jahr.';

  public chartColors: Array<ChartColors> = [];

  public chartLegend: boolean = true;
  public chartType: string = 'LineWithLine';

  public _name: string = 'marker-detail-estimated-price-trend';

  public get isPropertyDetailPage() {
    return this.stateManager.isPropertyDetailPage;
  }

  public get hasChartDataSets(): boolean {
    return this.chartDataSets && this.chartDataSets.length > 0;
  }

  public get hasPropertyTrends(): boolean {
    return this.priceTrends ? this.hasTrends(this.priceTrends.property) : false;
  }

  private get hasCityTrends(): boolean {
    return this.priceTrends ? this.hasTrends(this.priceTrends.city) : false;
  }

  public get hasAnyTrends(): boolean {
    return this.hasPropertyTrends || this.hasCityTrends;
  }

  public get buttonSize(): string {
    return isSmallMobileDevice() ? 'small' : 'medium';
  }

  constructor(
    private stateManager: StateManagerService,
  ) {}

  public _showSignup(): void {
    this.showSignup.emit('trend');
  }

  public ngOnChanges(): void {
    if (this.priceTrends == null || !this.hasAnyTrends) {
      return;
    }

    const { property, city } = this.priceTrends;

    const component = this;

    this.chartColors = this.createChartColors(property, city);

    const customTooltips = (tooltip) => {
      // data
      if (tooltip.body) {
        const [ firstLine ] = tooltip.body[0].lines;
        this.pointPrice = firstLine.labelPrice;
        this.pointYear = firstLine.labelYear;
        this.pointQuarter = firstLine.labelQuarter;
        this.pointDiffPercent = firstLine.labelDiffPercent;
      }

      const tooltipEl = document.getElementById('chartjs-tooltip');
      const chartEl = document.getElementById('chartjs-chart');

      const chartElWidth = chartEl.offsetWidth;
      const chartElHeight = chartEl.offsetHeight;

      const chartElWidthHalf = Math.round(chartElWidth / 2);
      const chartElHeightHalf = Math.round(chartElHeight / 2);

      const tooltipArrowElLeft = document.getElementById('chartjs-arrowleft');
      const tooltipArrowElRight = document.getElementById('chartjs-arrowright');

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      // Display
      tooltipEl.style.opacity = '1';

      // Tooltip position
      if (tooltip.caretX > chartElWidthHalf) {
        tooltipEl.style.left = `${ tooltip.caretX - 200 }px`;
        tooltipArrowElRight.style.display = 'block';
        tooltipArrowElLeft.style.display = 'none';
      } else {
        tooltipEl.style.left = `${ tooltip.caretX + 10 }px`;
        tooltipArrowElLeft.style.display = 'block';
        tooltipArrowElRight.style.display = 'none';
      }

      if (tooltip.caretY > chartElHeightHalf) {
        tooltipEl.style.top = `${ tooltip.caretY - 50 }px`;
      } else {
        tooltipEl.style.top = `${ tooltip.caretY + 95 }px`;
      }
    };

    // disable animation
    Chart.defaults.global.animation = null;

    // char type
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function(ease) {
        // chart container options
        const chartContainer = document.getElementById('chartjs-container');
        if (!(component.viewSize.isLarge)) {
          chartContainer.style.padding = '0';
        }

        // get blur block options
        const chartEl = document.getElementById('chartjs-chart');
        const historyDataset = this.chart.getDatasetMeta(0).data;
        const dataBorderX = historyDataset[historyDataset.length - 1]._model.x;
        component.blurBlockOptions.width = `${ Math.round(chartEl.offsetWidth - dataBorderX) }px`;

        // 40px is a value of padding-top for marker-detail-estimated-price-trend__content
        component.blurBlockOptions.height = `${ Math.round(this.chart.scales['y-axis-0'].bottom + 41) }px`;

        Chart.controllers.line.prototype.draw.call(this, ease);

        // vertical line and point options
        const isTooltipActive = this.chart.tooltip._active && this.chart.tooltip._active.length;
        if (isTooltipActive) {
          component.drawIntersectionPoint(this.chart);
        }
      }
    });

    // chart data
    const dataSets = this.createChartDataSets(property, city);
    const elements = {
      line: { tension: 0 },
      point: { hoverRadius: 3 },
    };
    const fontStyle = {
      fontFamily: CHART_FONT_FAMILY,
      fontColor: CHART_TEXT_COLOR,
      fontStyle: CHART_FONT_WEIGHT,
      fontSize: CHART_FONT_SIZE,
      lineHeight: CHART_LINE_HEIGHT,
      letterSpacing: CHART_LETTER_SPACING,
    };
    const scales = {
      xAxes: [{
        ticks: {
          ...fontStyle,
        },
        gridLines: {
          drawOnChartArea: false,
          tickMarkLength: 8,
          color: CHART_X_AXES_GRID_LINES_COLOR,
        },
        type: 'time',
        time: {
          unit: 'year',
          round: 'month',
          tooltipFormat: 'MMM YYYY',
          displayFormats: {
            month: 'YYYY',
          }
        },
      }],
      yAxes: [{
        ticks: {
          ...fontStyle,
          callback: function (value, index, values) {
            if (component.viewSize.isLarge) {
              value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' EUR    ';
            } else {
              value = value.toLocaleString('de-DE')  + ' EUR    ';
            }
            return value ;
          }
        },
        gridLines: {
          drawBorder: false,
          color: CHART_Y_AXES_GRID_LINES_COLOR,
        },
      }],
    };
    const legend = {
      display: false,
    };
    const tooltips = {
      enabled: false,
      intersect: false,
      custom: customTooltips,
      xPadding: 12,
      yPadding: 8,
      displayColors: false,
      backgroundColor: CHART_TOOLTIP_BACKGROUND_COLOR,
      bodyFontSize: 30,
      bodyFontStyle: 300,
      bodySpacing: 0.5,
      callbacks: {
        label: function(tooltipItem, data) {
          const yLabelIndexPrice = data.datasets[tooltipItem.datasetIndex].data.findIndex((point) => {
            return (Number(point.y) === tooltipItem.yLabel);
          }) || 1;
          const yLabelPrevPrice = data.datasets[tooltipItem.datasetIndex].data[yLabelIndexPrice - 1].y;
          const diffPercent = (tooltipItem.yLabel - yLabelPrevPrice) / yLabelPrevPrice;
          // Values between 0.1 and 0.9 are displayed as 0,1% otherwise they are rounded to 1%
          const diffPercentRounded = Math.abs(diffPercent * 100) < 1
            ? Math.round(diffPercent * 1000) / 1000
            : Math.round(diffPercent * 100) / 100;
          const yLabelPrice = Math.round(tooltipItem.yLabel).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          const xLabelYear = new Date(moment(tooltipItem.xLabel, 'MMM-YYYY').toISOString()).getFullYear();
          const xLabelQuarter = `Q${ Math.floor((new Date(moment(tooltipItem.xLabel, 'MMM-YYYY').toISOString()).getMonth() + 3) / 3) }`;

          return {
            labelPrice: yLabelPrice,
            labelYear: xLabelYear,
            labelQuarter: xLabelQuarter,
            labelDiffPercent: diffPercentRounded,
          };
        },
        // remove title
        title: function(tooltipItem, data) {
          return;
        }
      }
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements,
      scales,
      legend,
      tooltips,
    };

    this.chartDataSets = dataSets;
    this.chartOptions = chartOptions;
  }

  ngAfterViewChecked(): void {
    // set blur block options
    const blurBlock = document.getElementById('chartjs-blurblock');
    if (blurBlock) {
      blurBlock.style.width = this.blurBlockOptions.width;
      blurBlock.style.height = this.blurBlockOptions.height;
    }
  }

  private hasTrends(trend: PriceTrendObj): boolean {
    return trend && trend.trends && trend.trends.length > 0;
  }

  private createChartColors(trend: PriceTrendObj, trendCity: PriceTrendObj): ChartColors[] {
    const trendColors: ChartColors[] = [
      this.createChartColorsForPriceTrends(PriceTrendType.Trend),  // Color for the solid line
      this.createChartColorsForPriceTrends(PriceTrendType.Trend),  // Color for the dashed line
    ];
    const trendCityColors: ChartColors[] = [
      this.createChartColorsForPriceTrends(PriceTrendType.TrendCity),  // Color for the solid line
      this.createChartColorsForPriceTrends(PriceTrendType.TrendCity),  // Color for the dashed line
    ];
    const trendColorsToUse = this.hasTrends(trend) ? trendColors : [];
    const trendCityColorsToUse = this.hasTrends(trendCity) ? trendCityColors : [];
    return [
      ...trendColorsToUse,
      ...trendCityColorsToUse,
    ];
  }

  private createChartColorsForPriceTrends(priceTrendType: PriceTrendType): ChartColors {
    return priceTrendType === PriceTrendType.Trend
      ? CHART_COLORS_PRICE_TREND
      : CHART_COLORS_PRICE_TREND_CITY;
  }

  private createChartDataSets(trend: PriceTrendObj, trendCity: PriceTrendObj): any[] {
    const trendDataSet = this.hasTrends(trend) ? this.createChartDataSet(trend) : [];
    const trendCityDataSet = this.hasTrends(trendCity) ? this.createChartDataSet(trendCity) : [];
    return [
      ...trendDataSet,
      ...trendCityDataSet,
    ];
  }

  private createChartDataSet(trend: PriceTrendObj): any[] {
    const estimatedPriceTrendCurrent = trend.trends.filter((estimatedPriceTrend) => {
      const trendYearCurrent = Number(moment(estimatedPriceTrend.date).format('YYYY'));
      return (trendYearCurrent >= FROM_YEAR && trendYearCurrent < BORDER_YEAR);
    });

    const estimatedPriceTrendForecast = trend.trends.filter((estimatedPriceTrend) => {
      const trendYearForecast = Number(moment(estimatedPriceTrend.date).format('YYYY'));
      return (trendYearForecast >= BORDER_YEAR && trendYearForecast <= TO_YEAR);
    });

    // for connect lines between estimatedPriceTrendForecast and estimatedPriceTrendCurrent
    estimatedPriceTrendForecast.unshift(estimatedPriceTrendCurrent[estimatedPriceTrendCurrent.length - 1]);

    const estimatedPriceTrendCurrentDataset = {
      label: 'Price Trend Current',
      data: this.priceTrendsToChartLineData(estimatedPriceTrendCurrent),
    };

    const estimatedPriceTrendForecastDataset = {
      borderDash: [5, 2],
      label: 'Price Trend Forecast',
      data: this.priceTrendsToChartLineData(estimatedPriceTrendForecast),
    };

    return [
      estimatedPriceTrendCurrentDataset,
      estimatedPriceTrendForecastDataset,
    ];
  }

  private priceTrendsToChartLineData(priceTrends: PriceTrend[]): any[] {
    return priceTrends.map(({date, price}) => {
      return {
        x: moment(date, 'YYYY-MM-DD').toISOString(),
        y: price,
      };
    });
  }

  private drawIntersectionPoint(chart: any): void {
    const activePoint = chart.tooltip._active[0],
      ctx = chart.ctx,
      x = activePoint.tooltipPosition().x,
      y = activePoint.tooltipPosition().y,

      topY = chart.scales['y-axis-0'].top,
      bottomY = chart.scales['y-axis-0'].bottom,
      topX = chart.scales['x-axis-0'].top,
      bottomX = chart.scales['x-axis-0'].bottom;

    const thisItem = chart.tooltip._data.datasets[activePoint._datasetIndex].data[activePoint._index];
    const thisItemYear = new Date(thisItem.x).getFullYear();

    // draw ???
    // draw line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = CHART_COLOR_TREND;
    ctx.stroke();
    ctx.restore();

    // draw point border
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = CHART_INTERSECTION_POINT;
    ctx.stroke();
    ctx.restore();

    // draw point
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
    ctx.strokeStyle = CHART_INTERSECTION_POINT;
    ctx.fillStyle = CHART_INTERSECTION_POINT;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // draw field
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = CHART_BACKGROUND_COLOR;
    ctx.stroke();
    ctx.restore();
  }
}
