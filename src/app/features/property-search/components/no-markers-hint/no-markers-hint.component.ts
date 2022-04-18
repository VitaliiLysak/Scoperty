import {
  Component,
  Input, Output,
  EventEmitter
} from '@angular/core';

import { MapFilterService } from '../../../../core/services/map-filter.service';

@Component({
  selector: 'app-hint-no-markers',
  templateUrl: './no-markers-hint.component.html',
  styleUrls: ['./no-markers-hint.component.css']
})

export class HintNoMarkersComponent {
  @Input() noMarkersInBound: boolean = false;
  @Input() isSidebarShown: boolean;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'hint-no-markers';

  constructor(
    public mapFilterService: MapFilterService
   ) { }

  public dismiss(): void {
    this.close.emit();
  }
}
