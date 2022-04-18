import { Component, EventEmitter, Output } from '@angular/core';

import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-visit-surroundings-window',
  templateUrl: './visit-surroundings.component.html',
  styleUrls: ['./visit-surroundings.component.css']
})
export class VisitSurroundingsWindowComponent {
  @Output() visitSurroundings: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'visit-surroundings-window';
  isSmallMobileDevice$ = isSmallMobileDevice$;

  public goToVisitSurroundings(): void {
    this.visitSurroundings.emit();
  }
}
