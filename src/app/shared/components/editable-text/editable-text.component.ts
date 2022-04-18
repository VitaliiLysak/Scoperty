import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  ValidatorFn,
} from '@angular/forms';

import { combineLatest } from 'rxjs';

import { isEnterKeyboardEvent } from '../../utils/keyboard-events.util';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: [
    './editable-text.component.css',
  ],
})
export class EditableTextComponent implements OnChanges, OnInit {
  @Input()
  identifier: string;

  @Input()
  label: string;

  @Input()
  value: string;

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  editing: boolean;

  @Output()
  editingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  nonEditableTextTransform: Function = ((value: string) => value);

  @Input()
  editableTextValidators: ValidatorFn[];

  @Input()
  editableTextValidatorErrorMessages: { [ error: string ]: string };

  @Input()
  editableTextInputMask: any; // FIXME: Replace any with a type

  @Output()
  save: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('editableText')
  input: ElementRef;

  public _name: string = 'editable-text';
  public temporaryValueControl: FormControl = new FormControl('');

  public get hasLabel(): boolean {
    return this.label && this.label.length > 0;
  }

  private get firstErrorKey(): string | null {
    if (!this.temporaryValueControl || this.temporaryValueControl.valid) {
      return null;
    }

    const errorKeys = Object.keys(this.temporaryValueControl.errors);
    return errorKeys && errorKeys.length > 0 ? errorKeys[0] : null;
  }

  public get firstErrorMessage(): string | null {
    return this.editableTextValidatorErrorMessages
      ? this.editableTextValidatorErrorMessages[this.firstErrorKey]
      : null;
  }

  public get wasTouchedAndHasErrors(): boolean {
    return (this.temporaryValueControl.dirty || this.temporaryValueControl.touched)
      && this.temporaryValueControl.invalid;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const changedValue = changes.value ? changes.value.currentValue : null;
    if (changedValue) {
      this.temporaryValueControl.setValidators(this.editableTextValidators);
      this.temporaryValueControl.setValue(changedValue);
    }

    const changedEditableTextValidators = changes.editableTextValidators ? changes.editableTextValidators.currentValue : null;
    if (changedEditableTextValidators) {
      this.temporaryValueControl.setValidators(changedEditableTextValidators);
    }

    const changedEditing = changes.editing ? changes.editing.currentValue : null;
    if (changedEditing) {
      this.focusTextField();
    }
  }

  public ngOnInit(): void {
    this.handleTemporaryValueChanges();
  }

  public onKeyPress(event: KeyboardEvent): void {
    const enterKeyPressed = isEnterKeyboardEvent(event);
    if (enterKeyPressed) {
      this.onSave();
    }
  }

  public onSave(): void {
    this.temporaryValueControl.markAsTouched();
    if (this.temporaryValueControl.invalid) {
      this.focusTextField();
      return;
    }

    this.value = this.temporaryValueControl.value;
    this.save.emit(this.value);
    this.editing = false;
    this.emitEditingChange();
  }

  public activateEditingMode(): void {
    this.editing = true;
    this.emitEditingChange();
    this.focusTextField();
  }

  private focusTextField(): void {
    setTimeout(() => this.input.nativeElement.focus(), 0);
  }

  private handleTemporaryValueChanges(): void {
    const temporaryValueStatusChanges$ = this.temporaryValueControl.statusChanges;
    const temporaryValueChanges$ = this.temporaryValueControl.valueChanges;

    combineLatest(
      temporaryValueStatusChanges$,
      temporaryValueChanges$,
    ).subscribe(([ status, value]) => {
      const valueToEmit = status === 'VALID' ? value : null;
      this.valueChange.emit(valueToEmit);
    });
  }

  private emitEditingChange(): void {
    this.editingChange.emit(this.editing);
  }
}
