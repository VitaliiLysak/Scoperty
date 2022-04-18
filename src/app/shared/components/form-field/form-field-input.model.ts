// Every component which should be used inside the form-field component
// needs to implement the FormFieldInput class and add FormFieldInput to providers.

export abstract class FormFieldInput {
  public identifier: string;

  public setInvalid(invalid: boolean, showValidation: boolean = true): void {
  }

  public setFilled(filled: boolean): void {
  }

  public setPaddingRight(padding: number): void {
  }
}
