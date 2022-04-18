import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IconsModule } from '../../icons/icons.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';

import { InputVolumeComponent } from './input-volume/input-volume.component';
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component';
import { OptionComponent } from './option/option.component';

const COMPONENTS: any[] = [
  InputVolumeComponent,
  CheckboxInputComponent,
  IconButtonComponent,
  OptionComponent,
];

const MODULES: any[] = [
  DirectivesModule,
  IconsModule,
  PipesModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,

    ...MODULES,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class ControlModule { }
