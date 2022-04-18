import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { isMobileDevice$ } from '../../../../../../shared/utils/responsive.util';

const IMAGE_URL = '../../../../assets/images/scoperty_plus/exposes.png';

@Component({
  selector: 'app-substep7',
  templateUrl: './substep7-email-form.component.html',
  styleUrls: ['./substep7-email-form.component.css']
})
export class Substep7EmailFormComponent {

  @Output() emailChange = new EventEmitter<string>();

  readonly imageUrl = IMAGE_URL;

  email = new FormControl('', [ Validators.email, Validators.required ]);
  form = new FormGroup({ email: this.email });
  isMobileDevice$ = isMobileDevice$;

  async onSubmit() {
    this.email.markAsTouched();
    this.email.markAsDirty();

    if (this.email.valid) {
      this.emailChange.emit(this.email.value);
    }
  }
}
