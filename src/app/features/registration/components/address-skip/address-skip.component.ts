import { Component, OnInit, OnDestroy } from '@angular/core';

import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface AddressSkipModel {
  title: string;
}

@Component({
  selector: 'app-address-skip',
  templateUrl: './address-skip.component.html',
  styleUrls: ['./address-skip.component.css']
})

export class AddressSkipComponent
  extends DialogComponent <AddressSkipModel, string>
  implements AddressSkipModel, OnInit, OnDestroy {

  public title: string;

  public _name: string = 'address-skip';

  public isMobileDevice: boolean = document.body.clientWidth < 760;

  private _listener(): void {
    this.isMobileDevice = document.body.clientWidth < 760;
  }

  constructor(
    public dialogService: DialogService,
  ) {
    super(dialogService);

    this._listener = this._listener.bind(this);
  }

  public ngOnInit(): void {
    window.addEventListener('resize', this._listener);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    window.removeEventListener('resize', this._listener);
  }

  public async apply() {
    this.result = 'activatePhoneTab';
    this.close();
  }

}
