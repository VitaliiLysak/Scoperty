import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import {
  templateStatusToBackend,
  statusToFrontEndOriginal,
} from '../../../../shared/utils/deserializator.util';
import { SearchAlert } from '../../../../core/models/search-alert.model';
import {
  EmailFrequencyDto,
  PropertyStatusDto
} from '../../../../core/models/properties-repository.model';
import { LivingArea } from '../../../../shared/pipes/living-area.pipe';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

const SELLING_STATUS_ITEMS: PropertyStatusDto[] = [
  PropertyStatusDto.ForSale,
  PropertyStatusDto.MakeMeMove,
  PropertyStatusDto.Active,
];

@Component({
  selector: 'app-search-alerts-item',
  templateUrl: './search-alerts-item.component.html',
  styleUrls: ['./search-alerts-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAlertsItemComponent {
  @Input() searchAlert: SearchAlert;

  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output() saveSearchAlertName: EventEmitter<SearchAlert> = new EventEmitter<SearchAlert>();
  @Output() updateEmailFrequency: EventEmitter<SearchAlert> = new EventEmitter<SearchAlert>();

  public name: string = 'search-alerts-item';
  public searchAlertNameValidators: ValidatorFn[] = [
    Validators.required,
    Validators.maxLength(30),
  ];
  public validatorErrorMessages: { [ error: string ]: string } = {
    required: `Bitte gib einen Namen ein`,
    maxlength: `Der Name darf nicht länger als 30 Zeichen sein`,
  };

  public get nameOfTemplate(): string {
    return !this.searchAlert.name ? 'Suche' : this.searchAlert.name.slice(0, 29);
  }

  public get getOrderedSellingStatusItems(): string[] {
    return SELLING_STATUS_ITEMS.filter((sellingStatus) => {
      return this.searchAlert.sellingStatuses.includes(sellingStatus);
    });
  }

  public get showBudget() {
    return !isNullOrUndefined(this.searchAlert.priceMin) && !isNullOrUndefined(this.searchAlert.priceMax);
  }

  public get emailFrequency(): boolean {
    return this.searchAlert.emailFrequency !== 'weekly';
  }

  public get livingArea(): LivingArea {
    return {
      min: this.searchAlert.livingAreaMin,
      max: this.searchAlert.livingAreaMax
    };
  }

  public getIconColor(status: string): string {
    return templateStatusToBackend(status);
  }

  public getStatusFE(status: PropertyStatusDto): string {
    return statusToFrontEndOriginal(status);
  }

  public onAlertNameSave(alertName: string): void {
    this.searchAlert.name = alertName;
    this.saveSearchAlertName.emit(this.searchAlert);
  }

  public changeEmailFrequency(emailFrequency: EmailFrequencyDto): void {
    this.searchAlert.emailFrequency = emailFrequency === EmailFrequencyDto.Weekly
      ? EmailFrequencyDto.Immediately
      : EmailFrequencyDto.Weekly;
    this.updateEmailFrequency.emit(this.searchAlert);
  }

  public deleteTemplate(): void {
    this.deleteItem.emit(this.searchAlert.uuid);
  }
}
