import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-change-privacy',
  templateUrl: './change-privacy.component.html',
  styleUrls: [
    '../../pages/property-settings/property-settings-additional.css',
  ],
})
export class ChangePrivacyComponent implements OnChanges {
  @Input()
  sellingStatus: string;

  @Output()
  sellingStatusChange: EventEmitter<string> = new EventEmitter<string>();

  public _name: string = 'property-settings';

  public privacy: boolean;

  private get sellingStatusFromPrivacy(): string {
    if (this.privacy) {
      return 'Idle';
    } else {
      return 'Active';
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const changedSellingStatus = changes.sellingStatus ? changes.sellingStatus.currentValue : null;
    if (changedSellingStatus) {
      this.privacy = changedSellingStatus === 'Idle';
    } else {
      this.privacy = false;
    }
  }

  public onPrivacyChange(newPrivacy: boolean): void {
    this.privacy = newPrivacy;
    this.sellingStatus = this.sellingStatusFromPrivacy;
    this.sellingStatusChange.emit(this.sellingStatus);
  }
}
