import {
  Component,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';

import { PropertyDetailModalAction } from '../property-detail-info/property-detail-info.component';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { ActionWithOfferPrice } from '../../../../shared/components/marker-detail-make-me-move/marker-detail-make-me-move.component';

@Component({
  selector: 'app-property-detail-header',
  templateUrl: './property-detail-header.component.html',
  styleUrls: [
    './property-detail-header.component.css',
  ],
})
export class PropertyDetailHeaderComponent {
  @Input() activeMarker: ExtendedMarkerModel;
  @Input() offerPrice: number;

  @Output() toggleMakeMeMoveModal: EventEmitter<ActionWithOfferPrice> = new EventEmitter<ActionWithOfferPrice>();
  @Output() toggleContactMeForm: EventEmitter<PropertyDetailModalAction> = new EventEmitter<PropertyDetailModalAction>();
  @Output() toggleSlideshow: EventEmitter<void> = new EventEmitter<void>();

  public name: string = 'property-detail-header';

  public openMakeMeMoveModal(action: ActionWithOfferPrice): void {
    this.toggleMakeMeMoveModal.emit(action);
  }

  public openContactMeForm(): void {
    this.toggleContactMeForm.emit();
  }

  public openSlideshow(): void {
    this.toggleSlideshow.emit();
  }
}
