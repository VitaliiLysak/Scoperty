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

import { ApplyCssClassesService } from '../../services/apply-css-classes.service';

type IconButtonColor = 'primary-dark' | 'primary-green' | 'secondary-dark' | 'secondary-green' | 'white' | 'full-white';
type IconButtonSize = 'auto' | 'small-medium';
type IconButtonShape = 'none' | 'circle' | 'round';

const ALL_CSS_CLASSES: string[] = (() => {
  return [
    'button',
    ...([ 'primary-dark', 'primary-green', 'secondary-dark', 'secondary-green', 'white', 'full-white' ]
        .map(color => `icon-button--color-${ color }`)
    ),
    ...([ 'auto', 'small', 'small-medium', 'medium' ]
        .map(size => `icon-button--size-${ size }`)
    ),
    ...([ 'none', 'circle', 'round', 'left-round', 'right-round' ]
        .map(shape => `icon-button--shape-${ shape }`)
    ),
    ...([ 'true', 'false' ]
        .map(disabled => `icon-button--disabled-${ disabled }`)
    ),
  ];
})();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[app-icon-button]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  providers: [
    ApplyCssClassesService,
  ],
  styleUrls: [
    './icon-button.component.css',
  ],
})
export class IconButtonComponent implements AfterContentInit, OnInit, OnChanges {
  @Input() color: IconButtonColor = 'primary-dark';
  @Input() size: IconButtonSize = 'auto';
  @Input() shape: IconButtonShape = 'none';
  @Input() disabled: boolean;

  @HostBinding('attr.disabled')
  get hostDisabled(): boolean {
    return this.disabled || null;
  }

  private get cssClasses(): string[] {
    return [
      'icon-button',
      this.color ? `icon-button--color-${ this.color }` : 'icon-button--color-primary-dark',
      this.size ? `icon-button--size-${ this.size }` : 'icon-button--size-auto',
      this.shape ? `icon-button--shape-${ this.shape }` : 'icon-button--shape-none',
      this.disabled ? `icon-button--disabled-true` : 'icon-button--disabled-false',
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
