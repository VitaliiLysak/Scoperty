import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  EventEmitter,
  Output,
  QueryList,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';

import {
  ScrollToConfigOptions,
  ScrollToService,
} from '@nicky-lenaers/ngx-scroll-to';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

import { StepperHeaderTabDirective } from './stepper-header-tab.directive';

@Component({
  selector: 'app-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: [
    './stepper-header.component.css',
  ],
})
export class StepperHeaderComponent implements OnChanges, AfterContentInit {
  @Input() activeTab: string;
  @Output() activeTabChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('tabsContainer')
  tabsContainerElement: ElementRef;

  @ContentChildren(StepperHeaderTabDirective)
  tabElementList: QueryList<StepperHeaderTabDirective>;

  public _name: string = 'stepper-header';

  public isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  constructor(private scrollToService: ScrollToService) {
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
    this.scrollToTabsContainer();
  }

  private setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    this.activeTabChange.emit(this.activeTab);
  }

  private scrollToTabsContainer(): void {
    const config: ScrollToConfigOptions = {
      target: this.tabsContainerElement,
      duration: 650,
      easing: 'easeOutElastic',
      offset: 20
    };
    this.scrollToService.scrollTo(config);
  }
}
