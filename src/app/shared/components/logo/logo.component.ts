import { Component, Input, } from '@angular/core';

import { isMobileDevice } from '../../utils/responsive.util';

export type LogoColor = 'light' | 'dark';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {
  @Input() color: LogoColor = 'dark';

  public _name: string = 'logo';

  public get iconWidth(): string {
    return isMobileDevice() ? '90px' : '114px';
  }
}
