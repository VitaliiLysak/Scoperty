import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

import { ExtendedMarkerModel } from '../../../../../core/models/extended-marker.model';
import { WINDOW } from '../../../../../core/services/window.provider';
import { PropertyDetailData } from '../../../../../core/models/properties-repository.model';
import { ScopertyPlusAdService } from '../../../../../core/services/scoperty-plus-ad.service';

@Component({
  selector: 'app-property-view',
  templateUrl: './scoperty-plus-property-view.component.html',
  styleUrls: [
    './scoperty-plus-property-view.component.css',
  ],
})
export class ScopertyPlusPropertyViewComponent {
  name: string = 'property-view';

  @Input() indexPropertyPagination: number = 0;
  @Input() marker: ExtendedMarkerModel;
  @Input() propertyDetailData: PropertyDetailData[] = [];
  @Input() openWithoutAddress: boolean;
  @Input() scrapedWithoutAddressGroupedQuantity: number;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeProperty: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private scopertyPlusAdService: ScopertyPlusAdService,
    private modalService: NgxModalStack,
    @Inject(WINDOW) private window: Window,
  ) {
  }

  closePopup(): void {
    this.close.emit();
  }

  async goToScopertyPlusOnBoard(): Promise<void> {
    await this.scopertyPlusAdService.openScopertyOnBoard();
  }
}
