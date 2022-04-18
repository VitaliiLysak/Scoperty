import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { CITIES } from '../../../../main/main.constants';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { LatLng } from '../../../../core/models/coordinates.model';

interface ShownCity {
  name: string;
  displayName: string;
  imagePath: {[scale: string]: string};
}

@Component({
  selector: 'app-start-page-cities',
  templateUrl: './start-page-cities.component.html',
  styleUrls: ['./start-page-cities.component.css']
})
export class StartPageCitiesComponent {
  public name: string = 'start-page-cities';

  public cities: ShownCity[] = [
    {
      name: 'BERLIN',
      displayName: 'Berlin',
      imagePath: {
        '1x': 'assets/images/start-page/cities/berlin_500px.jpg',
        '1.5x': 'assets/images/start-page/cities/berlin_750px.jpg',
        '2x': 'assets/images/start-page/cities/berlin_1000px.jpg',
      }
    }, {
      name: 'HAMBURG',
      displayName: 'Hamburg',
      imagePath: {
        '1x': 'assets/images/start-page/cities/hamburg_500px.jpg',
        '1.5x': 'assets/images/start-page/cities/hamburg_750px.jpg',
        '2x': 'assets/images/start-page/cities/hamburg_1000px.jpg',
      }
    }, {
      name: 'MUNICH',
      displayName: 'München',
      imagePath: {
        '1x': 'assets/images/start-page/cities/munich_500px.jpg',
        '1.5x': 'assets/images/start-page/cities/munich_750px.jpg',
        '2x': 'assets/images/start-page/cities/munich_1000px.jpg',
      }
    }, {
      name: 'KOLN',
      displayName: 'Köln',
      imagePath: {
        '1x': 'assets/images/start-page/cities/cologne_500px.jpg',
        '1.5x': 'assets/images/start-page/cities/cologne_750px.jpg',
        '2x': 'assets/images/start-page/cities/cologne_1000px.jpg',
      }
    }, {
      name: 'FRANKFURT',
      displayName: 'Frankfurt',
      imagePath: {
        '1x': 'assets/images/start-page/cities/frankfurt_500px.jpg',
        '1.5x': 'assets/images/start-page/cities/frankfurt_750px.jpg',
        '2x': 'assets/images/start-page/cities/frankfurt_1000px.jpg',
      }
    },
  ];

  constructor(
    private router: Router,
    private mapManager: MapManagerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {}

  public openCity(city: ShownCity): void {

    const coordinates: LatLng = CITIES[city.name];

    this.router.navigate(['/map'], {
      queryParamsHandling: 'merge',
      queryParams: {
        lat: coordinates.LATITUDE,
        lng: coordinates.LONGITUDE,
        zoom: 14
      }
    });
  }
}
