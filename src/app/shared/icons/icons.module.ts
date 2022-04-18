import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatIconRegistry,
} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { SVG_ICONS } from './icons';

@NgModule({
  imports: [
    HttpClientModule,

    MatIconModule,
  ],
  exports: [
    MatIconModule,
  ],
})
export class IconsModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.registerSvgIcons();
  }

  private registerSvgIcons(): void {
    SVG_ICONS.forEach(iconName => {
      const iconPath = `assets/icons/${ iconName }.svg`;
      const trustedIconUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(iconPath);
      this.matIconRegistry.addSvgIcon(iconName, trustedIconUrl);
    });
  }
}
