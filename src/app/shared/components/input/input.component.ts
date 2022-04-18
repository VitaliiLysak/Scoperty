import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { FormFieldInput } from '../form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../form-field/form-field-input.provider';
import { ApplyCssClassesService } from '../../services/apply-css-classes.service';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

export type InputSize = 'small' | 'medium';

const ALL_CSS_CLASSES: string[] = (() => {
  return [
    'input',
    ...([ 'default', 'error', 'filled' ].map(state => `input--state-${ state }`)),
    ...([ 'small', 'medium' ].map(size => `input--size-${ size }`)),
  ];
})();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input[app-input], textarea[app-input]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  providers: [
    ApplyCssClassesService,
    createFormFieldInputProvider(InputComponent),
  ],
  styleUrls: [
    './input.component.css',
  ],
})
export class InputComponent implements AfterContentInit, OnInit, OnChanges, FormFieldInput {
  @Input() size: InputSize = 'medium';

  private invalid: boolean;
  private filled: boolean;
  private paddingRight: number;
  private showValidation: boolean;

  @HostBinding('style.padding-right')
  get hostPaddingRight(): string {
    return isNullOrUndefined(this.paddingRight) ? null : `${ this.paddingRight }px`;
  }

  get nativeElement(): HTMLInputElement | HTMLTextAreaElement {
    return this.elementRef.nativeElement;
  }

  private get cssClasses(): string[] {
    return [
      'input',
      this.size ? `input--size-${ this.size }` : 'input--size-medium',
      this.stateCssClass,
    ];
  }

  private get stateCssClass(): string {
    if (this.showValidation && this.invalid) {
      return 'input--state-error';
    }

    if (this.filled) {
      return 'input--state-filled';
    }

    return 'input--state-default';
  }

  constructor(
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private renderer: Renderer2,
    private applyCssClasses: ApplyCssClassesService,
  ) {
  }

  ngAfterContentInit(): void {
    this.applyAllCssClasses();
  }

  ngOnInit(): void {
    this.applyAllCssClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyAllCssClasses();
  }

  public get identifier(): string {
    return this.elementRef.nativeElement.id;
  }

  public setInvalid(invalid: boolean, showValidation: boolean): void {
    this.invalid = invalid;
    this.showValidation = showValidation;
    this.applyAllCssClasses();
  }

  public setFilled(filled: boolean): void {
    this.filled = filled;
    this.applyAllCssClasses();
  }

  public setPaddingRight(padding: number): void {
    this.paddingRight = padding;
  }

  public focus(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 0);
  }

  private applyAllCssClasses(): void {
    this.applyCssClasses.applyCssClassesToElement(
      this.renderer,
      this.elementRef,
      ALL_CSS_CLASSES,
      this.cssClasses
    );
  }
}
