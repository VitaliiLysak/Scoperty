import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MAP_SETTINGS } from '../../main/main.constants';

import { MapsAutoCompleteService } from './maps-auto-complete.service';
import { LoggerService } from './logger/logger.service';
import { LoggerProvider } from './logger/logger.provider';
import { LOGGER } from './logger/logger.provider';

describe('MapsAutocompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        MapsAutoCompleteService,
        LoggerProvider,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // Cannot load googlemaps in testing, based on this google api mock:
    // https://github.com/ScottieR/angular-google-maps-mock/blob/master/maps.googleapis.com-maps-api.js
    this.google = {
      maps : {
        OverlayView:  function(): void { },
        Marker:       function(): void { },
        InfoWindow:   function(): void { },
        Map:          function(obj: any): void { },
        MapTypeId: { ROADMAP: true },
        LatLng: function(lat: number, lng: number): [number, number] {
          return [lat, lng];
        },
        places: {
          AutocompleteService: function(): any {
            return {
              getPlace: function(): { name: any } {
                return {
                  name: '',
                };
              },
            };
          },
          PlacesService: function(obj: any): any {
            return {
              PlacesServiceStatus: {
                OK: true
              },
              textSearch:   function(query: any): Array<any> { /// ???
                return [];
              },
              nearbySearch: function(query: any): Array<any> {
                return [];
              }
            };
          }
        }
      }
    };
  });

  beforeEach(async(inject([LOGGER],
                (logger: LoggerService) => {
    this.mapsAutocompleteService = new MapsAutoCompleteService(logger);
  })));

  beforeEach(() => {
    this.googleWrapper = this.google;

    const mapsModule = this.google.maps;
    const googleMapSettings: any = MAP_SETTINGS;

    this.fakeTag = document.createComment('app-map');
    document.body.appendChild(this.fakeTag);

    this.googleMap = new mapsModule.Map(this.fakeTag, googleMapSettings);
  });

  beforeEach(async(() => {
    this.testDataZanzibar = {
      address_components: [
        {
          long_name: 'Sansibar-Stadt',
          short_name: 'Sansibar-Stadt',
          types: ['natural_feature', 'establishment'],
        },
        {
          long_name: 'Tansania',
          short_name: 'TZ',
          types: ['country', 'political'],
        },
      ],
      adr_address: `Sansibar-Stadt, <span class="country-name">Tansania</span>`,
      formatted_address: 'Sansibar-Stadt, Tansania',
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
      id: '3a95e785257f737f1e0d4a9ee2f0176c19520c70',
      name: 'Sansibar-Stadt',
      place_id: 'ChIJ5QkpKmApXRgRX32brUqvNaA',
      reference: 'CmRbAAAALK83fGOEwpi1cG678HaGcdC8piWgcAzHeYqOMJ9QIYs6Pr1rIRwjXyiPNaNHAgXrp8QOHTOtDwSaPa2H1QgX6rNJrdjeI2X6zcI0' +
                 'dj20OqzgGkv8nmQyiz9Frls5vfnuEhB_gg4_8hUKZgSent1m7HB2GhQ_pi3xZHpFtQ_qRM09r3NIOW0ZuQ',
      scope: 'GOOGLE',
      url: 'https://maps.google.com/?q=Sansibar-Stadt&ftid=0x185d29602a2909e5:0xa035af4aad9b7d5f',
      utc_offset: 180,
    };
  }));

  beforeEach(async(() => {
    this.place_id = 'ChIJ5QkpKmApXRgRX32brUqvNaA'; // Unguja(Zanzibar) Tanzania
    this.placeName = 'unguja';
  }));

  it('should create instance', async(inject([LOGGER],
                (logger: LoggerService) => {
    const mapsAutocompleteService = new MapsAutoCompleteService(logger);
    expect(mapsAutocompleteService).toBeTruthy();
  })));

  it('#setInstance will set PlaceService instance of google\'s map and return undefined on call', async(() => {
    const result = this.mapsAutocompleteService.setInstance(this.googleWrapper, this.googleMap);
    expect(result).toBeUndefined();

    // events$ became having "true" value
    this.mapsAutocompleteService.events$
      .subscribe(value => {
        expect(value).toBe(true);
      });
  }));

  afterAll((() => {
    this.fakeTag.remove();
  }));
});
