import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { TabsHeaderTheme } from '../tabs-header.model';

@Component({
  selector: 'app-tabs-header-tab',
  templateUrl: './tabs-header-tab.component.html',
  styleUrls: [
    './tabs-header-tab.component.css',
  ],
})
export class TabsHeaderTabComponent {
  @Input() name: string;
  @Input() active: boolean;
  @Input() theme: TabsHeaderTheme = 'light';

  @Output() tabSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() mouseOver: EventEmitter<string> = new EventEmitter<string>();
  @Output() mouseOut: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding(`class.tabs-header-tab--theme-light`)
  get hostColorLight(): boolean {
    return this.theme === 'light';
  }

  @HostBinding(`class.tabs-header-tab--theme-dark`)
  get hostColorDark(): boolean {
    return this.theme === 'dark';
  }

  public _name: string = 'tabs-header-tab';

  public onMouseOver(): void {
    this.mouseOver.emit(this.name);
  }

  public onMouseOut(): void {
    this.mouseOut.emit(this.name);
  }

  public onSelect(): void {
    this.tabSelect.emit(this.name);
  }
}
