import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgxActiveModal } from 'ngx-multi-modal';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
})
export class DeleteAccountComponent {
  public checkboxChecked: boolean = false;

  constructor(
    public activeModal: NgxActiveModal,
    private mapFilterService: MapFilterService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
  ) { }

  public checkboxChanged(state: boolean): void {
    this.checkboxChecked = state;
  }

  public apply(): void {
    this.authService.deleteUser()
      .pipe(switchMap(() => fromPromise(this.authService.logout())))
      .subscribe(() => {
        this.analyticsService.triggerFormSubmissionSuccess('deleteAccountForm', 'profile-page');
        this.activeModal.close();
        this.router.navigate([''], {queryParamsHandling: 'merge'});
      });
  }

  public close(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
