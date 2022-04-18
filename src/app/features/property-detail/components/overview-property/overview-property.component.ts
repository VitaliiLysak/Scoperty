import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { AddApartmentResult } from '../property-detail-add-apartment/property-detail-add-apartment.component';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';

@Component({
  selector: 'app-overview-property',
  templateUrl: './overview-property.component.html',
  styleUrls: [
    './overview-property.component.css',
  ],
})
export class OverviewPropertyComponent {
  @Input() marker: ExtendedMarkerModel;

  @Output() addApartment: EventEmitter<AddApartmentResult> = new EventEmitter<AddApartmentResult>();

  public _name: string = 'overview-property';

  public userMode: string = 'show';

  constructor(private router: Router) {
  }

  public goToBroker(): void {
    this.router.navigate(
      [SHARED_ROUTES_NAMES.BROKER],
      { queryParamsHandling: 'merge' }
    );
  }

  public addApartmentToProperty(event: AddApartmentResult): void {
    this.addApartment.emit(event);
  }
}
