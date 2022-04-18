import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { pad } from 'lodash';
import { NgxActiveModal } from 'ngx-multi-modal';

import { OnBoardingStep, STEP_ITEMS } from '../../../../core/models/scoperty-plus-onboard.model';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { StringInputComponent } from '../../../../shared/components/string-input/string-input.component';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';

const IMAGE_URL = '../../../assets/images/scoperty_plus/exposes.png';
const REAL_PHONE_NUMBER = '089-124-794-100';

@Component({
  selector: 'app-scoperty-plus-onboard-third-step',
  templateUrl: './scoperty-plus-onboard-third-step.component.html',
  styleUrls: ['./scoperty-plus-onboard-third-step.component.css']
})
export class ScopertyPlusOnboardThirdStepComponent implements OnInit {

  readonly imageUrl = IMAGE_URL;

  @Input() parentForm: FormGroup;
  @Input() activeStepIndex: number;
  @Input() masterForm: OnBoardingStep;

  @Output() goToNextStep: EventEmitter<number> = new EventEmitter<number>();
  @Output() sendFormData: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('phoneInput') phoneInput: StringInputComponent;
  @ViewChild('datePicker') datePicker: DatepickerComponent;

  notValidPhone: boolean;
  notValidDate: boolean = null;
  stepItems: OnBoardingStep[] = STEP_ITEMS;
  phoneNumber: string = REAL_PHONE_NUMBER;
  certificate: File;
  dateResult: string;
  currentTime: string[];
  currentDay: number;
  showFileSizeError: boolean = false;
  showDateError: boolean = false;

  isMobileDevice$ = isMobileDevice$;

  get isFinalStep(): boolean {
    return this.activeStepIndex > 11;
  }

  constructor(
    private router: Router,
    private activeModal: NgxActiveModal,
  ) { }

  ngOnInit() {}

  get phoneControl(): FormControl {
    return this.masterForm[11].controls['phone_number'];
  }

  get dateTimeControl(): FormControl {
    return this.masterForm[11].controls['call_at'];
  }

  get mortgageControl(): FormControl {
    return this.masterForm[10].controls['mortgage_certificate'];
  }

  get certificateName(): string {
    if (this.masterForm[10].controls['mortgage_certificate'].value) {
      this.showFileSizeError = this.isCorrectFileSize(
        (this.masterForm[10].controls['mortgage_certificate'].value as ArrayBuffer).byteLength
      );
    }

    return this.masterForm[10].controls['mortgage_certificate_name'].value;
  }

  setCurrentDayAndTime() {
    const today: Date = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    let day = today.getDate();
    let hours = today.getHours();
    const currentMinutes = today.getMinutes();
    let minutes;
    if (hours > 17 || hours < 8) {
      this.currentTime = ['09:00'];
      day += 1;
    } else {
      if (currentMinutes <= 15) {
        minutes = '30';
      } else if (currentMinutes >= 45) {
        minutes = '30';
        hours += 1;
      } else {
        minutes = '00';
        hours += 1;
      }
      this.currentTime = [`${hours}:${minutes}`];
    }
    this.currentDay = day;
    this.dateResult = `${ pad(day + '') }.${ pad(month + 1 + '') }.${ year }`;
    this.updateDate({
      year: year,
      month: month,
      day: day,
      time: this.currentTime[0]
    });
  }

  chooseStepNumber(stepNumber: number) {
    this.goToNextStep.emit(stepNumber);
  }

  onCertificateChange(file: File): void {
    if (!isNullOrUndefined(file)) {
      this.certificate = file;
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent) => {
        this.showFileSizeError = this.isCorrectFileSize(file.size);
        this.masterForm[10].controls['mortgage_certificate'].setValue(fileReader.result);
        this.masterForm[10].controls['mortgage_certificate_name'].setValue(file.name);
        this.masterForm[10].controls['mortgage_certificate_type'].setValue(file.type);
        this.chooseStepNumber(10);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  isCorrectFileSize(bytes: number = 0, precision: number = 2): boolean {
    if (!isFinite(bytes)) {
      return;
    }

    let unit = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      unit ++;
    }

    const fileSize = parseFloat(bytes.toFixed(precision));
    if (unit < 2) {
      return false;
    } else if (unit === 2) {
      if (fileSize <= 12) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  isValidDate() {
    if (!this.notValidDate || !this.datePicker.isTimeSelected) {
      this.showDateError =  true;
    } else {
      this.showDateError = false;
    }
  }

  sendForm13() {
    let valid = true;
    this.isValidDate();

    if (!this.notValidPhone) {
      this.phoneInput.validate();
      if (!this.phoneInput.isValid) {
        valid = false;
      }
    }

    if (this.notValidDate === null) {
      this.notValidDate = true;
      valid = false;
    }

    if (this.notValidDate) {
      valid = false;
    }

    if (!this.datePicker.isTimeSelected) {
      valid = false;
    }

    if (!valid) {
      return;
    }

    this.phoneControl.setValue(this.phoneInput.value);

    this.chooseStepNumber(13);
    this.sendFormData.emit();
  }

  sendForm(stepNumber) {
    if (
      !(this.mortgageControl.value === '')
    ) {
      this.chooseStepNumber(stepNumber);
      this.sendFormData.emit(stepNumber);
    } else {
      return;
    }
  }

  onPhoneBlur() {
    this.phoneInput.validate();
  }

  updateDate(selectedDates) {
    const isTimeValid = !isNullOrUndefined(selectedDates.time);
    const isDateValid = !isNullOrUndefined(selectedDates.day);

    if (isDateValid && isTimeValid) {
      this.notValidDate = false;
      const time = selectedDates.time.split(':');
      const callAt = new Date(selectedDates.year, selectedDates.month, selectedDates.day, time[0], time[1]).toISOString();
      this.dateTimeControl.setValue(callAt);
    }

    if (isDateValid || !isTimeValid) {
      this.notValidDate = false;
    }

    if (!isDateValid && !isTimeValid) {
      this.notValidDate = true;
    }
  }

  goToNewStep(): void {
    this.goToNextStep.emit();
  }

  goToMapPage(): void {
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.MAP }` ];
    this.router.navigate(url, { queryParamsHandling: 'merge' });
    this.onDismiss();
  }

  onDismiss(): void {
    this.activeModal.dismiss();
  }
}
