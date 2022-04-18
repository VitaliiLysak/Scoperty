import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { STEP_ITEMS } from '../../../../core/models/scoperty-plus-onboard.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CognitoUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-scoperty-plus-onboard-second-step',
  templateUrl: './scoperty-plus-onboard-second-step.component.html',
  styleUrls: ['./scoperty-plus-onboard-second-step.component.css']
})
export class ScopertyPlusOnboardSecondStepComponent {
  @Input() activeStepIndex: number;
  @Input() propertiesCount: number;

  @Output() goToNextStep = new EventEmitter<number | void>();
  @Output() sub = new EventEmitter<string>();

  @Input() email: string;
  @Output() emailChange = new EventEmitter<string>();

  get label(): string {
    return this.activeStepIndex === 6
      ? STEP_ITEMS[this.activeStepIndex].label.replace('{quantity}', this.propertiesCount.toString())
      : STEP_ITEMS[this.activeStepIndex].label;
  }

  constructor(private authService: AuthService) {}

  async onEmailChange(email: string) {
    this.email = email;
    this.emailChange.emit(email);

    const isUserWithEmailExist = await this.authService.isUserWithEmailExist(email);

    if (isUserWithEmailExist) {
      this.goToNextStep.emit(8);
    } else {
      this.goToNextStep.emit();
    }
  }

  onReturnToEmail(): void {
    this.email = '';
    this.emailChange.emit('');
    this.goToNextStep.emit(6);
  }

  onSignUp(user: CognitoUser): void {
    this.sub.emit(user.attributes.sub);
    this.goToNextStep.emit(9);
  }

  onSignIn(user: CognitoUser): void {
    this.sub.emit(user.attributes.sub);
    this.goToNextStep.emit(9);
  }
}
