import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { ApplyCssClassesService } from '../../services/apply-css-classes.service';

export type ButtonColor = 'primary-dark' | 'primary-green' | 'primary-red' | 'primary-white' |
  'secondary-dark' | 'secondary-green' | 'secondary-white' | 'secondary-red' | 'inline-green' |
  'dark' | 'green' | 'delete' | 'white' | 'light-blue';
type ButtonStyle = 'button' | 'link';
type ButtonSize = 'small' | 'medium' | 'large';

const ALL_CSS_CLASSES: string[] = (() => {
  return [
    'button',
    ...([ 'primary-dark', 'primary-green', 'primary-red', 'primary-white', 'secondary-dark',
          'secondary-green', 'secondary-white', 'inline-green', 'dark', 'green', 'delete', 'white', 'light-blue']
      .map(color => `button--color-${ color }`)
    ),
    ...([ 'button', 'link' ]
      .map(buttonStyle => `button--style-${ buttonStyle }`)
    ),
    ...([ 'small', 'medium', 'large' ]
      .map(size => `button--size-${ size }`)
    ),
    ...([ 'true', 'false' ]
      .map(stretch => `button--stretch-${ stretch }`)
    ),
    ...([ 'true', 'false' ]
      .map(disabled => `button--disabled-${ disabled }`)
    ),
  ];
})();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[app-button]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ApplyCssClassesService,
  ],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.css',
  ],
})
export class ButtonComponent implements AfterContentInit, OnInit, OnChanges {
  @Input() color: ButtonColor = 'primary-dark';
  @Input() buttonStyle: ButtonStyle = 'button';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() stretch: boolean = false;
  @Input() narrowPadding: boolean = false;

  @HostBinding('attr.disabled')
  get hostDisabled(): boolean {
    return this.disabled || null;
  }

  private get cssClasses(): string[] {
    return [
      'button',
      this.size ? `button--size-${ this.size }` : 'button--size-medium',
      this.color ? `button--color-${ this.color }` : 'button--color-primary-dark',
      this.buttonStyle ? `button--style-${ this.buttonStyle }` : 'button--style-button',
      this.stretch ? `button--stretch-${ this.stretch }` : 'button--stretch-false',
      this.disabled ? `button--disabled-true` : 'button--disabled-false',
      this.narrowPadding ? `button--narrow-padding-true` : 'button--narrow-padding-false',
    ];
  }

  constructor(
    private elementRef: ElementRef,
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

  private applyAllCssClasses(): void {
    this.applyCssClasses.applyCssClassesToElement(
      this.renderer,
      this.elementRef,
      ALL_CSS_CLASSES,
      this.cssClasses
    );
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[app-button]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ApplyCssClassesService,
  ],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.css',
  ],
})
export class AnchorComponent extends ButtonComponent {
  @HostListener('click', [ '$event' ])
  haltDisabledEvents(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
