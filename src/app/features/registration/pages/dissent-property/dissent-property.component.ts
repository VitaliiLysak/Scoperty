import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { IAddressData } from '../../components/address/address.model';
import { IPhoneData } from '../../components/phone/phone.model';
import { DissentType } from '../../models/dissent-type.model';
import { RegistrationMode } from '../../models/registration-mode.model';
import { StepperHeaderComponent } from '../../../../shared/components/stepper-header/stepper-header.component';

type TabType = 'verify' | 'address' | 'opposition';

interface TabModel {
  name: TabType;
  text: string;
}

const TABS: TabModel[] = [
  {
    name: 'verify',
    text: 'VERIFIZIEREN',
  },
  {
    name: 'address',
    text: 'IMMOBILIE',
  },
  {
    name: 'opposition',
    text: 'WIDERSPRUCH',
  },
];

@Component({
  selector: 'app-dissent-property',
  templateUrl: './dissent-property.component.html',
  styleUrls: [
    './dissent-property.component.css',
  ],
})
export class DissentPropertyComponent {
  @Input() activeTab: TabType = 'verify';
  @Input() role: string = '';
  @Input() reloadOwnership: boolean = false;
  @Input() needPrefillData: boolean = false;
  @Input() markerId: string = null;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() dissent: EventEmitter<void> = new EventEmitter<void>();
  @Output() phoneComplete: EventEmitter<IPhoneData> = new EventEmitter<IPhoneData>();
  @Output() addressComplete: EventEmitter<IAddressData> = new EventEmitter<IAddressData>();
  @Output() oppositionComplete: EventEmitter<DissentType> = new EventEmitter<DissentType>();

  @ViewChild('tabsHeader')
  tabsHeader: StepperHeaderComponent;

  public _name: string = 'dissent-property';

  public mode: RegistrationMode = 'delete';
  public tabs: TabModel[] = TABS;

  public get isVerify(): boolean {
    return this.activeTab === 'verify';
  }

  public get isAddress(): boolean {
    return this.activeTab === 'address';
  }

  public get isOpposition(): boolean {
    return this.activeTab === 'opposition';
  }

  public onPhoneComplete(phoneData?: IPhoneData): void {
    this.tabsHeader.goToTab('address');
    this.phoneComplete.emit(phoneData);
  }

  public onAddressComplete(addressData?: IAddressData): void {
    this.tabsHeader.goToTab('opposition');
    this.addressComplete.emit(addressData);
  }

  public onOppositionComplete(dissentType: DissentType): void {
    this.oppositionComplete.emit(dissentType);
  }

  public onPropertyDissent(): void {
    this.dissent.emit();
  }

  public onClose(): void {
    this.close.emit();
  }
}
