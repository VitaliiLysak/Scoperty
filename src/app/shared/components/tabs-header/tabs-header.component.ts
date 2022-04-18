import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

import { TabsHeaderTheme } from './tabs-header.model';
import { TabsHeaderTabDirective } from './tabs-header-tab.directive';

@Component({
  selector: 'app-tabs-header',
  templateUrl: './tabs-header.component.html',
  styleUrls: [
    './tabs-header.component.css',
  ],
})
export class TabsHeaderComponent implements OnChanges, AfterContentInit {
  @Input() theme: TabsHeaderTheme = 'light';
  @Input() activeTab: string;

  @Output() activeTabChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('tabsContainer') tabsContainerElement: ElementRef;

  @ContentChildren(TabsHeaderTabDirective) tabElementList: QueryList<TabsHeaderTabDirective>;

  public _name: string = 'tabs-header';

  private hoveredTab: string;

  private get numberOfTabs(): number {
    return isNullOrUndefined(this.tabElementList)
      ? 0
      : this.tabElementList.length;
  }

  private get hoveredTabPosition(): number {
    if (isNullOrUndefined(this.tabElementList)) {
      return 0;
    }

    const tabs = this.tabElementList.toArray();
    const hoveredTab = isNullOrUndefined(this.hoveredTab) ? this.activeTab : this.hoveredTab;
    const hoveredTabElement = tabs.find(tabElement => {
      return tabElement.name === hoveredTab;
    });

    return tabs.indexOf(hoveredTabElement);
  }

  public get tabsThumbStyle(): { [ property: string ]: string } {
    if (this.theme === 'dark') {
      return null;
    }

    const width = `${ 100 / this.numberOfTabs }%`;
    const left = `${ this.hoveredTabPosition === 0 ? 0 : 100 / (this.hoveredTabPosition + 1) }%`;

    return {
      width,
      left,
    };
  }

  public isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  public ngAfterContentInit(): void {
    this.setActiveTab(this.activeTab);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const activeTab = changes.activeTab ? changes.activeTab.currentValue : null;
    if (!isNullOrUndefined(activeTab)) {
      this.setActiveTab(activeTab);
    }
  }

  public goToTab(tabName: string): void {
    this.setActiveTab(tabName);
  }

  public onTabSelect(tabName: string): void {
    this.setActiveTab(tabName);
  }

  public onHoverStart(tabName: string): void {
    this.hoveredTab = tabName;
  }

  public onHoverEnd(): void {
    this.hoveredTab = null;
  }

  private setActiveTab(tabName: string): void {
    this.activeTabChange.emit(tabName);
  }
}
