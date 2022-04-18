import {
  CommonModule,
  CurrencyPipe,
} from '@angular/common';
import { NgModule } from '@angular/core';

import { BEMPipe } from './bem.pipe';
import { BooleanToUserFriendly } from './bool-to-user-friendly.pipe';
import { CostPipe } from './cost.pipe';
import { CostPerM2Pipe } from './cost-per-m2.pipe';
import { FallbackValuePipe } from './fallback-value.pipe';
import { LocaleNumberPipe } from './locale-number.pipe';
import { NumberOfRoomsPipe } from './number-of-rooms.pipe';
import { LivingSurfacePipe } from './living-surface.pipe';
import { FloorPipe } from './floor.pipe';
import { PropertyTypesPipe } from './property-types.pipe';
import { InvalidValuePipe } from './invalid-value.pipe';
import { LivingAreaPipe } from './living-area.pipe';
import { MetersToKilometersPipe } from './meters-to-kilometers.pipe';

const PIPES: any[] = [
  BEMPipe,
  BooleanToUserFriendly,
  CostPipe,
  CostPerM2Pipe,
  FallbackValuePipe,
  LocaleNumberPipe,
  InvalidValuePipe,
  NumberOfRoomsPipe,
  LivingSurfacePipe,
  FloorPipe,
  PropertyTypesPipe,
  LivingAreaPipe,
  MetersToKilometersPipe,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ...PIPES,
  ],
  providers: [
    CostPipe,
    CurrencyPipe,
    LivingSurfacePipe
  ],
  declarations: [
    ...PIPES,
  ],
})
export class PipesModule {
}
