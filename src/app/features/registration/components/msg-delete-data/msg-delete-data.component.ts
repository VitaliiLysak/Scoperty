import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

export interface MesDeleteDataModel {
  title: string;
}

@Component({
  selector: 'app-mes-delete-data',
  templateUrl: './msg-delete-data.component.html',
  styleUrls: ['./msg-delete-data.component.css']
})

export class MsgDeleteDataComponent
  extends DialogComponent <MesDeleteDataModel, string>
  implements MesDeleteDataModel, OnInit, OnDestroy {

  public title: string = '';
  public _name: string = 'mes-delete-data';

  public isMobileDevice: boolean = document.body.clientWidth < 768;

  private _listener(): void {
    this.isMobileDevice = document.body.clientWidth < 768;
  }

  constructor(
    public dialogService: DialogService,
    private mapFilterService: MapFilterService,
    private router: Router,
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

  public onLogoClick(): void {
    this.router.navigate(
      [SHARED_ROUTES_NAMES.MAP],
      { queryParamsHandling: 'merge' }
    );
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
    this.close();
  }

  // @FIXME: later specify the behavior for the button
  public apply(): void {
    this.router.navigate(['/?refresh=1'], { queryParamsHandling: 'merge' });
    this.close();
  }
}
