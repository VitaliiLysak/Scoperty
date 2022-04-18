import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-spoiler',
  templateUrl: './spoiler.component.html',
  styleUrls: [
    './spoiler.component.css',
  ],
})
export class SpoilerComponent {
  @Input() type: 'unstyled' | 'styledheading' = 'unstyled';
  @Input() spoilerHeight: string = 'default';
  @Input() opened: boolean = false;
  @Input() heading: string = '';

  public _name: string = 'spoiler';

  toggleSpoiler(): void {
    this.opened = !this.opened;
  }
}
