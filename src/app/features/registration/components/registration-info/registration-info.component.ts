import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { RegistrationMode } from '../../models/registration-mode.model';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-registration-info',
  templateUrl: './registration-info.component.html',
  styleUrls: [
    './registration-info.component.css',
  ],
})
export class RegistrationInfoComponent {
  @Input() mode: RegistrationMode = null;

  @Output() acceptInfo: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'registration-info';

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public get isDeleteMode(): boolean {
    return this.mode === 'delete';
  }

  public onAcceptInfo(): void {
    this.acceptInfo.emit();
  }
}
