import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CognitoUser } from '../../../../../../core/models/user.model';
import { AuthService } from '../../../../../../core/services/auth.service';
import { isMobileDevice } from '../../../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-substep9',
  templateUrl: './substep9-login-form.component.html',
  styleUrls: ['./substep9-login-form.component.css']
})
export class Substep9LoginFormComponent implements OnInit {
  @Input() email: string;

  @Output() signIn = new EventEmitter<CognitoUser>();
  @Output() returnToEmail = new EventEmitter<void>();

  get controlsWidth() {
    return isMobileDevice() ? '100%' : '288px';
  }

  isNotConfirmed: boolean;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isNotConfirmed = await this.authService.isUserEmailNotConfirmed(this.email);
  }

  onEmailEdit() {
    this.returnToEmail.emit();
  }

  onSignIn(user: CognitoUser) {
    this.signIn.emit(user);
  }

  async confirmEmail () {
    await this.authService.resendConfirmation(this.email);
  }
}
