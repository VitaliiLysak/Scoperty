import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutoCollapseDirective } from './autocollapse.directive';
import { AutofocusDirective } from './autofocus.directive';
import { BlurDirective } from './blur.directive';
import { ClickOutsideDirective } from './clickoutside.directive';
import { DisableControlDirective } from './disablecontrol.directive';
import { MultilineTruncateDirective } from './multiline-truncate.directive';
import { SvgSizeDirective } from './svg-size.directive';

const DIRECTIVES: any[] = [
  AutoCollapseDirective,
  AutofocusDirective,
  BlurDirective,
  ClickOutsideDirective,
  DisableControlDirective,
  MultilineTruncateDirective,
  SvgSizeDirective,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ...DIRECTIVES,
  ],
  declarations: [
    ...DIRECTIVES,
  ],
})
export class DirectivesModule {
}
