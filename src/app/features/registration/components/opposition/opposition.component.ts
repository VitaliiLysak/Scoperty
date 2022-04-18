import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { NgxModalStack } from 'ngx-multi-modal';

import { DissentType } from '../../models/dissent-type.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import {
  DecisionButtonType,
  DecisionDialogComponent,
  DecisionDialogModel,
  DecisionDialogType,
} from '../../../../shared/components/decision-dialog/decision-dialog.component';

const REMOVE_PROPERTY_DIALOG_ACTION_NAME = 'remove_property';

@Component({
  selector: 'app-opposition',
  templateUrl: './opposition.component.html',
  styleUrls: [
    './opposition.component.css',
  ],
})
export class OppositionComponent implements OnInit, OnDestroy {
  @Output() propertyDissent: EventEmitter<void> = new EventEmitter<void>();
  @Output() oppositionCompleted: EventEmitter<DissentType> = new EventEmitter<DissentType>();

  public _name: string = 'opposition';

  public accept: boolean = false;

  public isMobileDevice: boolean = document.body.clientWidth < 768;

  private _listener(): void {
    this.isMobileDevice = document.body.clientWidth < 768;
  }

  constructor(
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
  ) {
    this._listener = this._listener.bind(this);
  }

  public ngOnInit(): void {
    window.addEventListener('resize', this._listener);
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this._listener);
  }

  public toggleAgreementButton(): void {
    this.accept = !this.accept;
  }

  public apply(): void {
    if (!this.accept) {
      return;
    }

    this.analyticsService.triggerFormSubmissionSuccess('oppositionForm', 'registration-opposition');

    this.oppositionCompleted.emit('remove_property');
    this.openDeleteDataForm();
  }

  async openDeleteDataForm(): Promise<void> {
    try {
      const dialogModel = this.removeEstimatedValueDialogModel;
      const modalRef = this.modalService.openFromComponent(DecisionDialogComponent);
      Object.assign(modalRef.instance, dialogModel);
      const modalResult = await modalRef.result;
      if (modalResult === REMOVE_PROPERTY_DIALOG_ACTION_NAME) {
        this.propertyDissent.emit();
      }
    } catch (error) {}
  }

  private get removeEstimatedValueDialogModel(): DecisionDialogModel {
    const message = this.isMobileDevice
      ? 'Achtung: Dies kann nicht mehr rückgängig gemacht werden!'
      : 'Achtung, dieser Schritt kann nicht mehr rückgängig gemacht werden.';

    return {
      title: 'Willst du deine Daten wirklich löschen?',
      message,
      type: DecisionDialogType.Error,
      buttons: [
        {
          name: 'cancel',
          type: DecisionButtonType.Cancel,
          label: 'Abbrechen',
          id: 'decision-dialog-stop-button',
        },
        {
          name: REMOVE_PROPERTY_DIALOG_ACTION_NAME,
          type: DecisionButtonType.Destructive,
          label: 'Löschen',
          id: 'decision-dialog-clear-button',
        },
      ],
    };
  }
}
