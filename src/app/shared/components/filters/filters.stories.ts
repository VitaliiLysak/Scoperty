import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  select,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import {
  CommonModule,
  registerLocaleData,
} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { ClassProvider } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  of,
} from 'rxjs';
import { delay } from 'rxjs/operators';

import { ButtonComponent } from '../button/button.component';
import { ControlModule } from '../controls/controls.module';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ExplanationComponent } from '../explanation/explanation.component';
import { InputComponent } from '../input/input.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { SellingStatusComponent } from '../selling-status/selling-status.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FilterOptions } from '../../../core/models/filter-options.model';
import {
  AppLocaleProvider,
  GERMAN_LOCALE,
} from '../../../app-locale.provider';
import { IHistogram } from '../../../core/models/marker.model';
import {
  PropertyType,
  QueryOptions,
} from '../../../core/models/properties-repository.model';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';

import { FiltersComponent } from './filters.component';
import { FiltersPosition } from './filters.model';

registerLocaleData(localeDe, GERMAN_LOCALE);

class PropertiesRepositoryServiceMock {
  getPriceHistogram(options: QueryOptions): Observable<IHistogram> {
    const { coordinates } = options;
    let rawData: string;
    if (coordinates === NurembergFixture.filterPosition.coordinates) {
      rawData = NurembergFixture.data;
    } else if (coordinates === FrankfurtFixture.filterPosition.coordinates) {
      rawData = FrankfurtFixture.data;
    } else if (coordinates === BerlinFixture.filterPosition.coordinates) {
      rawData = BerlinFixture.data;
    } else {
      rawData = '{}';
    }

    return of(JSON.parse(rawData))
      .pipe(
        delay(300),
      );
  }
}

const PropertiesRepositoryServiceMockProvider: ClassProvider = {
  provide: PropertiesRepositoryService,
  useClass: PropertiesRepositoryServiceMock,
};

const FILTER_OPTIONS_ALL: FilterOptions = {
  PropertyType: null,
  PriceFrom: 10000,
  PriceTo: 100 * 1000,
  PriceDevelopmentFrom: 20 * 1000,
  PriceDevelopmentTo: 200 * 1000,
  AreaSize: 40,
  AreaSize2: 80,
  SellingStatus: {
    Idle: false,
    MakeMeMove: false,
    ForSale: false,
    Active: false,
  },
};

const FILTER_OPTIONS_EFH: FilterOptions = {
  PropertyType: PropertyType.EFH,
  PriceFrom: 50000,
  PriceTo: 500 * 1000,
  PriceDevelopmentFrom: 60 * 1000,
  PriceDevelopmentTo: 600 * 1000,
  AreaSize: 80,
  AreaSize2: 120,
  SellingStatus: {
    Idle: false,
    MakeMeMove: true,
    ForSale: false,
    Active: false,
  },
};

const FILTER_OPTIONS_ETW: FilterOptions = {
  PropertyType: PropertyType.ETW,
  PriceFrom: 30000,
  PriceTo: 300 * 1000,
  PriceDevelopmentFrom: 40 * 1000,
  PriceDevelopmentTo: 400 * 1000,
  AreaSize: 60,
  AreaSize2: 100,
  SellingStatus: {
    Idle: false,
    MakeMeMove: false,
    ForSale: true,
    Active: false,
  },
};

const FILTER_OPTIONS_NONE: FilterOptions = {
  PropertyType: PropertyType.PropertyTypeWhereReturnZeroProperties,
  PriceFrom: 70000,
  PriceTo: 700 * 1000,
  PriceDevelopmentFrom: 80 * 1000,
  PriceDevelopmentTo: 800 * 1000,
  AreaSize: 140,
  AreaSize2: 180,
  SellingStatus: {
    Idle: false,
    MakeMeMove: true,
    ForSale: true,
    Active: false,
  },
};

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ControlModule,

    NgbTooltipModule,
    TextMaskModule,

    PipesModule,
  ],
  providers: [
    AppLocaleProvider,
    PropertiesRepositoryServiceMockProvider,
  ],
  declarations: [
    ButtonComponent,
    ErrorMessageComponent,
    ExplanationComponent,
    FiltersComponent,
    FormFieldComponent,
    InputComponent,
    LoadingIndicatorComponent,
    SellingStatusComponent,
  ],
});

interface FiltersFixture {
  filterPosition: FiltersPosition;
  data: string;
}

// Nuremberg: ?lat=49.45191&lng=11.07463&zoom=14
const NurembergFixture: FiltersFixture = {
  filterPosition: {
    coordinates: {
      nwLatitude: 8692,
      nwLongitude: 5594,
      seLongitude: 8699,
      seLatitude: 5596,
    },
    zoom: 14,
  },
  // tslint:disable-next-line:max-line-length
  data: '{"minimum":980000.0,"maximum":1660000.0,"average":30310.0,"histogram":[{"intervalLowerLimit":980000.0,"intervalUpperLimit":1000000.0,"count":2},{"intervalLowerLimit":1000000.0,"intervalUpperLimit":1020000.0,"count":1},{"intervalLowerLimit":240000.0,"intervalUpperLimit":260000.0,"count":165},{"intervalLowerLimit":140000.0,"intervalUpperLimit":160000.0,"count":671},{"intervalLowerLimit":100000.0,"intervalUpperLimit":120000.0,"count":1407},{"intervalLowerLimit":380000.0,"intervalUpperLimit":400000.0,"count":911},{"intervalLowerLimit":160000.0,"intervalUpperLimit":180000.0,"count":305},{"intervalLowerLimit":1020000.0,"intervalUpperLimit":1040000.0,"count":1},{"intervalLowerLimit":2220000.0,"intervalUpperLimit":2240000.0,"count":1},{"intervalLowerLimit":1220000.0,"intervalUpperLimit":1240000.0,"count":1},{"intervalLowerLimit":2520000.0,"intervalUpperLimit":2540000.0,"count":1},{"intervalLowerLimit":20000.0,"intervalUpperLimit":40000.0,"count":34051},{"intervalLowerLimit":180000.0,"intervalUpperLimit":200000.0,"count":282},{"intervalLowerLimit":20040000.0,"intervalUpperLimit":20060000.0,"count":1},{"intervalLowerLimit":3100000.0,"intervalUpperLimit":3120000.0,"count":2},{"intervalLowerLimit":2740000.0,"intervalUpperLimit":2760000.0,"count":1},{"intervalLowerLimit":460000.0,"intervalUpperLimit":480000.0,"count":747},{"intervalLowerLimit":2580000.0,"intervalUpperLimit":2600000.0,"count":1},{"intervalLowerLimit":580000.0,"intervalUpperLimit":600000.0,"count":295},{"intervalLowerLimit":0.0,"intervalUpperLimit":20000.0,"count":146977},{"intervalLowerLimit":1240000.0,"intervalUpperLimit":1260000.0,"count":1},{"intervalLowerLimit":40000.0,"intervalUpperLimit":60000.0,"count":7458},{"intervalLowerLimit":480000.0,"intervalUpperLimit":500000.0,"count":706},{"intervalLowerLimit":1280000.0,"intervalUpperLimit":1300000.0,"count":1},{"intervalLowerLimit":2200000.0,"intervalUpperLimit":2220000.0,"count":1},{"intervalLowerLimit":5840000.0,"intervalUpperLimit":5860000.0,"count":1},{"intervalLowerLimit":120000.0,"intervalUpperLimit":140000.0,"count":1610},{"intervalLowerLimit":500000.0,"intervalUpperLimit":520000.0,"count":599},{"intervalLowerLimit":300000.0,"intervalUpperLimit":320000.0,"count":433},{"intervalLowerLimit":23420000.0,"intervalUpperLimit":23440000.0,"count":1},{"intervalLowerLimit":4860000.0,"intervalUpperLimit":4880000.0,"count":1},{"intervalLowerLimit":1620000.0,"intervalUpperLimit":1640000.0,"count":1},{"intervalLowerLimit":9660000.0,"intervalUpperLimit":9680000.0,"count":1},{"intervalLowerLimit":3660000.0,"intervalUpperLimit":3680000.0,"count":1},{"intervalLowerLimit":940000.0,"intervalUpperLimit":960000.0,"count":5},{"intervalLowerLimit":680000.0,"intervalUpperLimit":700000.0,"count":110},{"intervalLowerLimit":900000.0,"intervalUpperLimit":920000.0,"count":6},{"intervalLowerLimit":860000.0,"intervalUpperLimit":880000.0,"count":8},{"intervalLowerLimit":560000.0,"intervalUpperLimit":580000.0,"count":317},{"intervalLowerLimit":440000.0,"intervalUpperLimit":460000.0,"count":963},{"intervalLowerLimit":2640000.0,"intervalUpperLimit":2660000.0,"count":1},{"intervalLowerLimit":11000000.0,"intervalUpperLimit":11020000.0,"count":1},{"intervalLowerLimit":60000.0,"intervalUpperLimit":80000.0,"count":2243},{"intervalLowerLimit":220000.0,"intervalUpperLimit":240000.0,"count":117},{"intervalLowerLimit":800000.0,"intervalUpperLimit":820000.0,"count":18},{"intervalLowerLimit":200000.0,"intervalUpperLimit":220000.0,"count":180},{"intervalLowerLimit":1420000.0,"intervalUpperLimit":1440000.0,"count":1},{"intervalLowerLimit":1060000.0,"intervalUpperLimit":1080000.0,"count":2},{"intervalLowerLimit":1100000.0,"intervalUpperLimit":1120000.0,"count":1},{"intervalLowerLimit":3000000.0,"intervalUpperLimit":3020000.0,"count":1},{"intervalLowerLimit":960000.0,"intervalUpperLimit":980000.0,"count":1},{"intervalLowerLimit":420000.0,"intervalUpperLimit":440000.0,"count":772},{"intervalLowerLimit":2100000.0,"intervalUpperLimit":2120000.0,"count":1},{"intervalLowerLimit":1040000.0,"intervalUpperLimit":1060000.0,"count":2},{"intervalLowerLimit":760000.0,"intervalUpperLimit":780000.0,"count":23},{"intervalLowerLimit":21760000.0,"intervalUpperLimit":21780000.0,"count":1},{"intervalLowerLimit":1120000.0,"intervalUpperLimit":1140000.0,"count":2},{"intervalLowerLimit":400000.0,"intervalUpperLimit":420000.0,"count":787},{"intervalLowerLimit":4680000.0,"intervalUpperLimit":4700000.0,"count":1},{"intervalLowerLimit":700000.0,"intervalUpperLimit":720000.0,"count":77},{"intervalLowerLimit":820000.0,"intervalUpperLimit":840000.0,"count":14},{"intervalLowerLimit":1080000.0,"intervalUpperLimit":1100000.0,"count":1},{"intervalLowerLimit":6000000.0,"intervalUpperLimit":6020000.0,"count":1},{"intervalLowerLimit":320000.0,"intervalUpperLimit":340000.0,"count":718},{"intervalLowerLimit":2020000.0,"intervalUpperLimit":2040000.0,"count":1},{"intervalLowerLimit":600000.0,"intervalUpperLimit":620000.0,"count":275},{"intervalLowerLimit":360000.0,"intervalUpperLimit":380000.0,"count":952},{"intervalLowerLimit":660000.0,"intervalUpperLimit":680000.0,"count":150},{"intervalLowerLimit":780000.0,"intervalUpperLimit":800000.0,"count":22},{"intervalLowerLimit":1140000.0,"intervalUpperLimit":1160000.0,"count":1},{"intervalLowerLimit":26280000.0,"intervalUpperLimit":26300000.0,"count":1},{"intervalLowerLimit":26700000.0,"intervalUpperLimit":26720000.0,"count":1},{"intervalLowerLimit":640000.0,"intervalUpperLimit":660000.0,"count":129},{"intervalLowerLimit":5360000.0,"intervalUpperLimit":5380000.0,"count":1},{"intervalLowerLimit":520000.0,"intervalUpperLimit":540000.0,"count":398},{"intervalLowerLimit":80000.0,"intervalUpperLimit":100000.0,"count":793},{"intervalLowerLimit":540000.0,"intervalUpperLimit":560000.0,"count":359},{"intervalLowerLimit":2800000.0,"intervalUpperLimit":2820000.0,"count":1},{"intervalLowerLimit":280000.0,"intervalUpperLimit":300000.0,"count":203},{"intervalLowerLimit":620000.0,"intervalUpperLimit":640000.0,"count":179},{"intervalLowerLimit":260000.0,"intervalUpperLimit":280000.0,"count":169},{"intervalLowerLimit":720000.0,"intervalUpperLimit":740000.0,"count":52},{"intervalLowerLimit":15520000.0,"intervalUpperLimit":15540000.0,"count":1},{"intervalLowerLimit":340000.0,"intervalUpperLimit":360000.0,"count":832},{"intervalLowerLimit":840000.0,"intervalUpperLimit":860000.0,"count":11},{"intervalLowerLimit":6680000.0,"intervalUpperLimit":6700000.0,"count":1},{"intervalLowerLimit":880000.0,"intervalUpperLimit":900000.0,"count":6},{"intervalLowerLimit":47340000.0,"intervalUpperLimit":47360000.0,"count":1},{"intervalLowerLimit":920000.0,"intervalUpperLimit":940000.0,"count":9},{"intervalLowerLimit":740000.0,"intervalUpperLimit":760000.0,"count":26},{"intervalLowerLimit":1640000.0,"intervalUpperLimit":1660000.0,"count":1}]}',
};

// Frankfurt: ?lat=50.11092&lng=8.68213&zoom=14
const FrankfurtFixture: FiltersFixture = {
  filterPosition: {
    coordinates: {
      nwLatitude: 8583,
      nwLongitude: 5547,
      seLongitude: 8590,
      seLatitude: 5549,
    },
    zoom: 14,
  },
  // tslint:disable-next-line:max-line-length
  data: '{"minimum":980000.0,"maximum":2360000.0,"average":19476.0,"histogram":[{"intervalLowerLimit":980000.0,"intervalUpperLimit":1000000.0,"count":27},{"intervalLowerLimit":1000000.0,"intervalUpperLimit":1020000.0,"count":23},{"intervalLowerLimit":1180000.0,"intervalUpperLimit":1200000.0,"count":18},{"intervalLowerLimit":1840000.0,"intervalUpperLimit":1860000.0,"count":3},{"intervalLowerLimit":240000.0,"intervalUpperLimit":260000.0,"count":249},{"intervalLowerLimit":1680000.0,"intervalUpperLimit":1700000.0,"count":4},{"intervalLowerLimit":1940000.0,"intervalUpperLimit":1960000.0,"count":3},{"intervalLowerLimit":140000.0,"intervalUpperLimit":160000.0,"count":1295},{"intervalLowerLimit":2360000.0,"intervalUpperLimit":2380000.0,"count":1},{"intervalLowerLimit":100000.0,"intervalUpperLimit":120000.0,"count":3358},{"intervalLowerLimit":380000.0,"intervalUpperLimit":400000.0,"count":250},{"intervalLowerLimit":160000.0,"intervalUpperLimit":180000.0,"count":909},{"intervalLowerLimit":1020000.0,"intervalUpperLimit":1040000.0,"count":24},{"intervalLowerLimit":2120000.0,"intervalUpperLimit":2140000.0,"count":2},{"intervalLowerLimit":1400000.0,"intervalUpperLimit":1420000.0,"count":6},{"intervalLowerLimit":1220000.0,"intervalUpperLimit":1240000.0,"count":22},{"intervalLowerLimit":2520000.0,"intervalUpperLimit":2540000.0,"count":1},{"intervalLowerLimit":20000.0,"intervalUpperLimit":40000.0,"count":77385},{"intervalLowerLimit":180000.0,"intervalUpperLimit":200000.0,"count":423},{"intervalLowerLimit":1780000.0,"intervalUpperLimit":1800000.0,"count":4},{"intervalLowerLimit":2160000.0,"intervalUpperLimit":2180000.0,"count":4},{"intervalLowerLimit":2000000.0,"intervalUpperLimit":2020000.0,"count":4},{"intervalLowerLimit":1860000.0,"intervalUpperLimit":1880000.0,"count":2},{"intervalLowerLimit":2740000.0,"intervalUpperLimit":2760000.0,"count":1},{"intervalLowerLimit":460000.0,"intervalUpperLimit":480000.0,"count":164},{"intervalLowerLimit":580000.0,"intervalUpperLimit":600000.0,"count":112},{"intervalLowerLimit":1300000.0,"intervalUpperLimit":1320000.0,"count":10},{"intervalLowerLimit":1700000.0,"intervalUpperLimit":1720000.0,"count":8},{"intervalLowerLimit":0.0,"intervalUpperLimit":20000.0,"count":83655},{"intervalLowerLimit":1240000.0,"intervalUpperLimit":1260000.0,"count":17},{"intervalLowerLimit":40000.0,"intervalUpperLimit":60000.0,"count":29803},{"intervalLowerLimit":480000.0,"intervalUpperLimit":500000.0,"count":173},{"intervalLowerLimit":1280000.0,"intervalUpperLimit":1300000.0,"count":18},{"intervalLowerLimit":1460000.0,"intervalUpperLimit":1480000.0,"count":10},{"intervalLowerLimit":1900000.0,"intervalUpperLimit":1920000.0,"count":4},{"intervalLowerLimit":2200000.0,"intervalUpperLimit":2220000.0,"count":1},{"intervalLowerLimit":120000.0,"intervalUpperLimit":140000.0,"count":2194},{"intervalLowerLimit":500000.0,"intervalUpperLimit":520000.0,"count":108},{"intervalLowerLimit":300000.0,"intervalUpperLimit":320000.0,"count":291},{"intervalLowerLimit":1620000.0,"intervalUpperLimit":1640000.0,"count":12},{"intervalLowerLimit":1540000.0,"intervalUpperLimit":1560000.0,"count":19},{"intervalLowerLimit":940000.0,"intervalUpperLimit":960000.0,"count":25},{"intervalLowerLimit":680000.0,"intervalUpperLimit":700000.0,"count":72},{"intervalLowerLimit":900000.0,"intervalUpperLimit":920000.0,"count":61},{"intervalLowerLimit":1340000.0,"intervalUpperLimit":1360000.0,"count":5},{"intervalLowerLimit":1760000.0,"intervalUpperLimit":1780000.0,"count":6},{"intervalLowerLimit":860000.0,"intervalUpperLimit":880000.0,"count":43},{"intervalLowerLimit":560000.0,"intervalUpperLimit":580000.0,"count":141},{"intervalLowerLimit":2300000.0,"intervalUpperLimit":2320000.0,"count":1},{"intervalLowerLimit":440000.0,"intervalUpperLimit":460000.0,"count":243},{"intervalLowerLimit":60000.0,"intervalUpperLimit":80000.0,"count":13438},{"intervalLowerLimit":220000.0,"intervalUpperLimit":240000.0,"count":270},{"intervalLowerLimit":1480000.0,"intervalUpperLimit":1500000.0,"count":11},{"intervalLowerLimit":800000.0,"intervalUpperLimit":820000.0,"count":53},{"intervalLowerLimit":200000.0,"intervalUpperLimit":220000.0,"count":405},{"intervalLowerLimit":1420000.0,"intervalUpperLimit":1440000.0,"count":14},{"intervalLowerLimit":1880000.0,"intervalUpperLimit":1900000.0,"count":1},{"intervalLowerLimit":1060000.0,"intervalUpperLimit":1080000.0,"count":16},{"intervalLowerLimit":1100000.0,"intervalUpperLimit":1120000.0,"count":17},{"intervalLowerLimit":960000.0,"intervalUpperLimit":980000.0,"count":40},{"intervalLowerLimit":420000.0,"intervalUpperLimit":440000.0,"count":238},{"intervalLowerLimit":2100000.0,"intervalUpperLimit":2120000.0,"count":1},{"intervalLowerLimit":1040000.0,"intervalUpperLimit":1060000.0,"count":17},{"intervalLowerLimit":1500000.0,"intervalUpperLimit":1520000.0,"count":29},{"intervalLowerLimit":760000.0,"intervalUpperLimit":780000.0,"count":51},{"intervalLowerLimit":1120000.0,"intervalUpperLimit":1140000.0,"count":41},{"intervalLowerLimit":400000.0,"intervalUpperLimit":420000.0,"count":264},{"intervalLowerLimit":1260000.0,"intervalUpperLimit":1280000.0,"count":21},{"intervalLowerLimit":1960000.0,"intervalUpperLimit":1980000.0,"count":3},{"intervalLowerLimit":700000.0,"intervalUpperLimit":720000.0,"count":86},{"intervalLowerLimit":1580000.0,"intervalUpperLimit":1600000.0,"count":8},{"intervalLowerLimit":820000.0,"intervalUpperLimit":840000.0,"count":57},{"intervalLowerLimit":1080000.0,"intervalUpperLimit":1100000.0,"count":20},{"intervalLowerLimit":1520000.0,"intervalUpperLimit":1540000.0,"count":24},{"intervalLowerLimit":320000.0,"intervalUpperLimit":340000.0,"count":402},{"intervalLowerLimit":2020000.0,"intervalUpperLimit":2040000.0,"count":2},{"intervalLowerLimit":600000.0,"intervalUpperLimit":620000.0,"count":81},{"intervalLowerLimit":360000.0,"intervalUpperLimit":380000.0,"count":368},{"intervalLowerLimit":660000.0,"intervalUpperLimit":680000.0,"count":59},{"intervalLowerLimit":780000.0,"intervalUpperLimit":800000.0,"count":69},{"intervalLowerLimit":1140000.0,"intervalUpperLimit":1160000.0,"count":11},{"intervalLowerLimit":1920000.0,"intervalUpperLimit":1940000.0,"count":2},{"intervalLowerLimit":640000.0,"intervalUpperLimit":660000.0,"count":78},{"intervalLowerLimit":2440000.0,"intervalUpperLimit":2460000.0,"count":1},{"intervalLowerLimit":2140000.0,"intervalUpperLimit":2160000.0,"count":1},{"intervalLowerLimit":1380000.0,"intervalUpperLimit":1400000.0,"count":6},{"intervalLowerLimit":2560000.0,"intervalUpperLimit":2580000.0,"count":2},{"intervalLowerLimit":1660000.0,"intervalUpperLimit":1680000.0,"count":7},{"intervalLowerLimit":520000.0,"intervalUpperLimit":540000.0,"count":98},{"intervalLowerLimit":80000.0,"intervalUpperLimit":100000.0,"count":7309},{"intervalLowerLimit":540000.0,"intervalUpperLimit":560000.0,"count":86},{"intervalLowerLimit":2060000.0,"intervalUpperLimit":2080000.0,"count":2},{"intervalLowerLimit":2480000.0,"intervalUpperLimit":2500000.0,"count":1},{"intervalLowerLimit":1200000.0,"intervalUpperLimit":1220000.0,"count":31},{"intervalLowerLimit":1160000.0,"intervalUpperLimit":1180000.0,"count":10},{"intervalLowerLimit":280000.0,"intervalUpperLimit":300000.0,"count":180},{"intervalLowerLimit":620000.0,"intervalUpperLimit":640000.0,"count":114},{"intervalLowerLimit":1800000.0,"intervalUpperLimit":1820000.0,"count":2},{"intervalLowerLimit":2460000.0,"intervalUpperLimit":2480000.0,"count":1},{"intervalLowerLimit":1720000.0,"intervalUpperLimit":1740000.0,"count":4},{"intervalLowerLimit":1440000.0,"intervalUpperLimit":1460000.0,"count":8},{"intervalLowerLimit":2080000.0,"intervalUpperLimit":2100000.0,"count":4},{"intervalLowerLimit":1600000.0,"intervalUpperLimit":1620000.0,"count":5},{"intervalLowerLimit":260000.0,"intervalUpperLimit":280000.0,"count":282},{"intervalLowerLimit":1820000.0,"intervalUpperLimit":1840000.0,"count":1},{"intervalLowerLimit":2040000.0,"intervalUpperLimit":2060000.0,"count":1},{"intervalLowerLimit":720000.0,"intervalUpperLimit":740000.0,"count":89},{"intervalLowerLimit":1320000.0,"intervalUpperLimit":1340000.0,"count":10},{"intervalLowerLimit":340000.0,"intervalUpperLimit":360000.0,"count":217},{"intervalLowerLimit":840000.0,"intervalUpperLimit":860000.0,"count":64},{"intervalLowerLimit":2400000.0,"intervalUpperLimit":2420000.0,"count":1},{"intervalLowerLimit":880000.0,"intervalUpperLimit":900000.0,"count":44},{"intervalLowerLimit":2280000.0,"intervalUpperLimit":2300000.0,"count":2},{"intervalLowerLimit":1360000.0,"intervalUpperLimit":1380000.0,"count":11},{"intervalLowerLimit":1560000.0,"intervalUpperLimit":1580000.0,"count":10},{"intervalLowerLimit":1740000.0,"intervalUpperLimit":1760000.0,"count":6},{"intervalLowerLimit":920000.0,"intervalUpperLimit":940000.0,"count":28},{"intervalLowerLimit":740000.0,"intervalUpperLimit":760000.0,"count":88},{"intervalLowerLimit":1640000.0,"intervalUpperLimit":1660000.0,"count":3},{"intervalLowerLimit":2340000.0,"intervalUpperLimit":2360000.0,"count":3}]}',
};

// Berlin: ?lat=52.52001&lng=13.40495&zoom=14
const BerlinFixture: FiltersFixture = {
  filterPosition: {
    coordinates: {
      nwLatitude: 8798,
      nwLongitude: 5372,
      seLongitude: 8805,
      seLatitude: 5374,
    },
    zoom: 14,
  },
  // tslint:disable-next-line:max-line-length
  data: '{"minimum":980000.0,"maximum":760000.0,"average":4146.0,"histogram":[{"intervalLowerLimit":980000.0,"intervalUpperLimit":1000000.0,"count":5},{"intervalLowerLimit":1000000.0,"intervalUpperLimit":1020000.0,"count":10},{"intervalLowerLimit":1180000.0,"intervalUpperLimit":1200000.0,"count":1},{"intervalLowerLimit":240000.0,"intervalUpperLimit":260000.0,"count":46},{"intervalLowerLimit":140000.0,"intervalUpperLimit":160000.0,"count":158},{"intervalLowerLimit":100000.0,"intervalUpperLimit":120000.0,"count":381},{"intervalLowerLimit":380000.0,"intervalUpperLimit":400000.0,"count":30},{"intervalLowerLimit":160000.0,"intervalUpperLimit":180000.0,"count":148},{"intervalLowerLimit":1020000.0,"intervalUpperLimit":1040000.0,"count":1},{"intervalLowerLimit":1400000.0,"intervalUpperLimit":1420000.0,"count":2},{"intervalLowerLimit":1220000.0,"intervalUpperLimit":1240000.0,"count":4},{"intervalLowerLimit":20000.0,"intervalUpperLimit":40000.0,"count":67480},{"intervalLowerLimit":180000.0,"intervalUpperLimit":200000.0,"count":99},{"intervalLowerLimit":460000.0,"intervalUpperLimit":480000.0,"count":21},{"intervalLowerLimit":580000.0,"intervalUpperLimit":600000.0,"count":34},{"intervalLowerLimit":1300000.0,"intervalUpperLimit":1320000.0,"count":1},{"intervalLowerLimit":3120000.0,"intervalUpperLimit":3140000.0,"count":1},{"intervalLowerLimit":0.0,"intervalUpperLimit":20000.0,"count":258676},{"intervalLowerLimit":1240000.0,"intervalUpperLimit":1260000.0,"count":1},{"intervalLowerLimit":40000.0,"intervalUpperLimit":60000.0,"count":10048},{"intervalLowerLimit":480000.0,"intervalUpperLimit":500000.0,"count":85},{"intervalLowerLimit":120000.0,"intervalUpperLimit":140000.0,"count":212},{"intervalLowerLimit":500000.0,"intervalUpperLimit":520000.0,"count":83},{"intervalLowerLimit":300000.0,"intervalUpperLimit":320000.0,"count":19},{"intervalLowerLimit":940000.0,"intervalUpperLimit":960000.0,"count":12},{"intervalLowerLimit":680000.0,"intervalUpperLimit":700000.0,"count":90},{"intervalLowerLimit":900000.0,"intervalUpperLimit":920000.0,"count":20},{"intervalLowerLimit":1340000.0,"intervalUpperLimit":1360000.0,"count":2},{"intervalLowerLimit":860000.0,"intervalUpperLimit":880000.0,"count":46},{"intervalLowerLimit":560000.0,"intervalUpperLimit":580000.0,"count":88},{"intervalLowerLimit":440000.0,"intervalUpperLimit":460000.0,"count":19},{"intervalLowerLimit":60000.0,"intervalUpperLimit":80000.0,"count":2347},{"intervalLowerLimit":220000.0,"intervalUpperLimit":240000.0,"count":58},{"intervalLowerLimit":800000.0,"intervalUpperLimit":820000.0,"count":48},{"intervalLowerLimit":200000.0,"intervalUpperLimit":220000.0,"count":67},{"intervalLowerLimit":1100000.0,"intervalUpperLimit":1120000.0,"count":5},{"intervalLowerLimit":960000.0,"intervalUpperLimit":980000.0,"count":6},{"intervalLowerLimit":420000.0,"intervalUpperLimit":440000.0,"count":18},{"intervalLowerLimit":1040000.0,"intervalUpperLimit":1060000.0,"count":1},{"intervalLowerLimit":760000.0,"intervalUpperLimit":780000.0,"count":76},{"intervalLowerLimit":1120000.0,"intervalUpperLimit":1140000.0,"count":7},{"intervalLowerLimit":400000.0,"intervalUpperLimit":420000.0,"count":15},{"intervalLowerLimit":700000.0,"intervalUpperLimit":720000.0,"count":94},{"intervalLowerLimit":1580000.0,"intervalUpperLimit":1600000.0,"count":3},{"intervalLowerLimit":820000.0,"intervalUpperLimit":840000.0,"count":46},{"intervalLowerLimit":1080000.0,"intervalUpperLimit":1100000.0,"count":3},{"intervalLowerLimit":320000.0,"intervalUpperLimit":340000.0,"count":24},{"intervalLowerLimit":600000.0,"intervalUpperLimit":620000.0,"count":74},{"intervalLowerLimit":360000.0,"intervalUpperLimit":380000.0,"count":11},{"intervalLowerLimit":660000.0,"intervalUpperLimit":680000.0,"count":58},{"intervalLowerLimit":780000.0,"intervalUpperLimit":800000.0,"count":60},{"intervalLowerLimit":640000.0,"intervalUpperLimit":660000.0,"count":47},{"intervalLowerLimit":520000.0,"intervalUpperLimit":540000.0,"count":17},{"intervalLowerLimit":80000.0,"intervalUpperLimit":100000.0,"count":838},{"intervalLowerLimit":540000.0,"intervalUpperLimit":560000.0,"count":23},{"intervalLowerLimit":280000.0,"intervalUpperLimit":300000.0,"count":24},{"intervalLowerLimit":620000.0,"intervalUpperLimit":640000.0,"count":55},{"intervalLowerLimit":260000.0,"intervalUpperLimit":280000.0,"count":31},{"intervalLowerLimit":720000.0,"intervalUpperLimit":740000.0,"count":38},{"intervalLowerLimit":340000.0,"intervalUpperLimit":360000.0,"count":14},{"intervalLowerLimit":840000.0,"intervalUpperLimit":860000.0,"count":31},{"intervalLowerLimit":880000.0,"intervalUpperLimit":900000.0,"count":34},{"intervalLowerLimit":920000.0,"intervalUpperLimit":940000.0,"count":12},{"intervalLowerLimit":740000.0,"intervalUpperLimit":760000.0,"count":31}]}',
};

storiesOf('Filters/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Inline', () => {
    return {
      props: {
        filters: select('Filters', [ 'All', 'EFH', 'ETW', 'None' ], 'All'),
        filtersData: {
          All: FILTER_OPTIONS_ALL,
          EFH: FILTER_OPTIONS_EFH,
          ETW: FILTER_OPTIONS_ETW,
          None: FILTER_OPTIONS_NONE,
        },
      },
      template: `
        <div class="sp-section">
          <h1>Filters - Inline</h1>
          <table class="sp-layout-table" style="max-width: 572px;">
            <tr>
              <td>
                <app-filters
                  mode="inline"
                  [(filters)]="filtersData[filters]"
                ></app-filters>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ filtersData[filters] | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('Default', () => {
    return {
      props: {
        defaultFilters: {
          Idle: false,
          MakeMeMove: true,
          ForSale: true,
          Active: false,
        },
        filters: select('Filters', [ 'All', 'EFH', 'ETW', 'None' ], 'All'),
        filtersData: {
          All: FILTER_OPTIONS_ALL,
          EFH: FILTER_OPTIONS_EFH,
          ETW: FILTER_OPTIONS_ETW,
          None: FILTER_OPTIONS_NONE,
        },
        position: select('Position', [ 'Nuremberg', 'Frankfurt', 'Berlin' ], 'Nuremberg'),
        positionData: {
          Nuremberg: NurembergFixture.filterPosition,
          Frankfurt: FrankfurtFixture.filterPosition,
          Berlin: BerlinFixture.filterPosition,
        },
      },
      template: `
        <div class="sp-section">
          <h1>Filters - Default</h1>
          <table class="sp-layout-table" style="max-width: 232px;">
            <tr>
              <td>
                <app-filters
                  mode="default"
                  [defaultFilters]="defaultFilters"
                  [(filters)]="filtersData[filters]"
                  [position]="positionData[position]"
                ></app-filters>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ filtersData[filters] | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
