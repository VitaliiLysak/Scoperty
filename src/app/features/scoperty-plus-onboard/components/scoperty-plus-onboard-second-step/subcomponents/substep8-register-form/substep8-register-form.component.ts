import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CognitoUser } from '../../../../../../core/models/user.model';
import { isMobileDevice } from '../../../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-substep8',
  templateUrl: './substep8-register-form.component.html',
  styleUrls: ['./substep8-register-form.component.css']
})
export class Substep8RegisterFormComponent {
  @Input() email: string;

  @Output() signUp = new EventEmitter<CognitoUser>();
  @Output() returnToEmail = new EventEmitter<void>();

  get controlsWidth() {
    return isMobileDevice() ? '100%' : '288px';
  }

  onEmailEdit (): void {
    this.returnToEmail.emit();
  }

  onSignUp(user: CognitoUser): void {
    this.signUp.emit(user);
  }
}
