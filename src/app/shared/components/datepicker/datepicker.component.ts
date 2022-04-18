import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SelectItem } from 'ng2-select';

import { isMobileDevice$ } from '../../utils/responsive.util';

interface SelectedDates {
  day: number;
  time: string;
  year: number;
  month: number;
}

const MONTHS: string[] = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

const CALL_BACK_TIME: string[] = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
];

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  host: {
    '(document:click)': 'onCloseCalendar($event)'
  }
})
export class DatepickerComponent implements OnInit {

  @Input() label: string = 'Date';
  @Input() value: string;
  @Input() result: string;

  @Input() validError: boolean = false;
  @Output() validErrorChange = new EventEmitter<boolean>();

  _currentTime: string[];
  @Input()
  set currentTime(time: string[]) {
    this._currentTime = time;

    this.updateAvailibleTime();
  }

  get currentTime() {
    return this._currentTime;
  }

  @Input()
  set currentDay(day: number) {
    this.selectedDay = day;

    this.updateAvailibleTime();
  }

  get currentDay(): number {
    return this.selectedDay;
  }

  @Output() updateDate: EventEmitter<SelectedDates> = new EventEmitter<SelectedDates>();

  date: Date = new Date();
  month: number;
  months: string[] = MONTHS;
  callBackTime: string[] = CALL_BACK_TIME;
  year: number;
  days: number[];
  showCalendar: boolean = false;
  timeValue: string;
  selectedDay: number;
  isMobileDevice$ = isMobileDevice$;
  isTimeSelected: boolean = false;

  ngOnInit() {
    if (this.value) {
      this.date = new Date(this.value);
    }

    this.month = this.date.getMonth();
    this.year  = this.date.getFullYear();
    if (this.value) {
      this.selectDay(this.date.getDate());
    }

    this.updateMonth();

    this.updateAvailibleTime();
  }

  onTimeSelect(timeValue: SelectItem) {
    this.isTimeSelected = true;
    this.timeValue = timeValue.text;
    this.updateDate.emit({day: this.selectedDay, time: this.timeValue, year: this.year, month: this.month});
  }

  onInput(event: any) {
    if (event.target.value === '' || !this.isTimeSelected) {
      this.validError = true;
      this.selectedDay = null;
      this.validErrorChange.emit(this.validError);
    }
  }

  updateMonth(event?: Event, type?: string) {
    if (event) {
      event.stopPropagation();
    }

    if (type === 'dec') {
      this.month--;
    }

    if (type === 'inc') {
      this.month++;
    }

    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }

    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    const date = new Date(this.year, this.month, 0);
    const days = date.getDate();
    const day  = date.getDay();
    const prefix = new Array(day);
    const tempDaysArr = Array.from(Array(days).keys()).slice(1);

    this.days = prefix.concat(tempDaysArr);
  }

  selectDay(day: number) {
    if (!day) {
      return;
    }

    this.validError = false;

    const pad = select => select.length < 2 ? 0 + select : select;
    this.selectedDay = day;
    this.date = new Date(this.year, this.month, day);
    this.result = `${ pad(day + '') }.${ pad(this.month + 1 + '') }.${ this.year }`;
    this.updateDate.emit({day: this.selectedDay, time: this.timeValue, year: this.year, month: this.month});

    this.updateAvailibleTime();
  }

  onShowCalendar(event: Event) {
    event.stopPropagation();
    this.showCalendar = true;
  }

  onCloseCalendar(event: Event) {
    if (this.showCalendar) {
      this.showCalendar = false;
      this.updateDate.emit({day: this.selectedDay, time: this.timeValue, year: this.year, month: this.month});
    }
    return;
  }

  updateAvailibleTime() {
    const chosenDay = new Date();
    chosenDay.setFullYear(this.year, this.month, this.selectedDay || this.date.getDate());

    if (chosenDay.getDate() !== new Date().getDate()) {
      chosenDay.setHours(0, 0);
    }

    this.callBackTime = CALL_BACK_TIME.filter(time => {
      const parsedTime = time.split(':').map(part => parseInt(part, 10));
      const serializedTime = new Date(chosenDay);
      serializedTime.setHours(parsedTime[0]);
      serializedTime.setMinutes(parsedTime[1]);

      return chosenDay.getTime() - serializedTime.getTime() < 0;
    });
  }

  isDisableDay(day: number): boolean {
    const selectDay = new Date(this.year, this.month, day);
    const selectDayTime = selectDay.getTime();
    const today = moment();
    const yesterday = moment(today).subtract(1, 'days').valueOf();

    if (selectDayTime < yesterday) {
      return true;
    } else {
      return selectDay.getDay() === 6 || selectDay.getDay() === 0;
    }
  }
}
