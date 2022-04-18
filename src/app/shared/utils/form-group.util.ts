import { FormGroup } from '@angular/forms';

export function markFormGroupControlsAsTouched(formGroup: FormGroup): void {
  const formGroupKeys = Object.keys(formGroup.controls);
  formGroupKeys.forEach(key => {
    formGroup.get(key).markAsTouched();
  });
}

export function markFormGroupControlsAsDirty(formGroup: FormGroup): void {
  const formGroupKeys = Object.keys(formGroup.controls);
  formGroupKeys.forEach(key => {
    const formControl = formGroup.get(key);
    formControl.markAsTouched();
    formControl.markAsDirty();
  });
}
