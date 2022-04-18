import { Component } from '@angular/core';

import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';

@Component({
  selector: 'app-property-valuation-register-now',
  templateUrl: './property-valuation-register-now.component.html',
  styleUrls: [
    './property-valuation-register-now.component.css',
  ],
})
export class PropertyValuationRegisterNowComponent {
  public name: string = 'property-valuation-register-now';

  constructor(
    private showSignupModalService: ShowSignupModalService,
  ) {}

  public openSignup(): void {
    this.showSignupModalService.showSignup();
  }
}
