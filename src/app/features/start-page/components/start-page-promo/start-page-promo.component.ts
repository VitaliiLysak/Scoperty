import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { CITIES } from '../../../../main/main.constants';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { LatLng } from '../../../../core/models/coordinates.model';

@Component({
  selector: 'app-start-page-promo',
  templateUrl: './start-page-promo.component.html',
  styleUrls: ['./start-page-promo.component.css']
})
export class StartPagePromoComponent {
  public name: string = 'start-page-promo';

  private hideOnBoardingModal(): void {
    const preferredOptions = JSON.parse(this.localStorage.getItem('preferredOptions') || '{}');

    preferredOptions.hideModal = true;
    this.localStorage.setItem('preferredOptions', JSON.stringify(preferredOptions));
  }

  constructor(
    private router: Router,
    private mapManager: MapManagerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {}

  public goToMap(city: string): void {
    this.hideOnBoardingModal();

    const coordinates: LatLng = CITIES[city];

    this.mapManager.saveMapSettings({
      zoom: 14,
      mapTypeId: 'styled',
      center: {
        lat: coordinates.LATITUDE,
        lng: coordinates.LONGITUDE
      },
      activeMarkerId: '',
      activeMarkerType: null,
      needOpenDetailWindow: false,
    });

    this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
  }
}
