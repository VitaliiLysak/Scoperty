import {
  Component,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-authentication-phone-number',
  templateUrl: './authentication-phone-number.component.html',
  styleUrls: [
    './authentication-phone-number.component.css',
  ],
})
export class AuthenticationPhoneNumberComponent {
  @Input() userIsAuthenticated: boolean;
  @Input() phoneNumber: FormControl;

  public name: string = 'authentication-phone-number';

  public phoneNumberIsEditable: boolean = false;

  public editPhoneNumber(): void {
    this.phoneNumberIsEditable = true;
  }
}
