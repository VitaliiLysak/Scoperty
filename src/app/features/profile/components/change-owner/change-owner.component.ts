import { Component, EventEmitter, OnChanges, Output, } from '@angular/core';

import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';

interface Option {
  delete: string;
}

@Component({
  selector: 'app-change-owner',
  templateUrl: './change-owner.component.html',
  styleUrls: [
    '../../pages/property-settings/property-settings-additional.css',
  ],
})
export class ChangeOwnerComponent implements OnChanges {
  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  public _name = 'property-settings';

  public isConfirmDelete: boolean = false;

  public options: Option =  {
    delete: 'save',
  };

  public get ratioLabel(): string {
    return isSmallMobileDevice()
      ? 'Alle Eingaben behalten'
      : 'Alle Eingaben behalten (empfohlen)';
  }

  public ngOnChanges() {
    this.isConfirmDelete = false;
  }

  public async onRemoveOwnership(): Promise<void> {
    if (!this.isConfirmDelete) {
      this.isConfirmDelete = true;
      return;
    }

    this.remove.emit();
  }
}
