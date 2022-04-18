import {
  Component,
  Input,
} from '@angular/core';

import { throttle } from 'lodash';

import { isSmallMobileDevice } from '../../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-question-button',
  templateUrl: './question-button.component.html',
  styleUrls: ['./question-button.component.css']
})

export class QuestionButtonComponent {

  @Input() containerClass: string;
  @Input() placement = 'top';

  public triggerClickOnPopper;

  public popperModifiers: any = {
    hide: {
      enabled: false,
    },
    flip: {
      enabled: false,
    },
    preventOverflow: {
      enabled: false
    },
  };

  public _name: string = 'question-button';

  constructor() {
    this.triggerClickOnPopper = throttle((poper) => {
      requestAnimationFrame(() => poper.click());
    }, 300);

    this.insertRules(0);
  }

  public insertRules(i: number = 0): void {
    if (i > document.styleSheets.length) return;
    // I hate angular style incapsulation :(
    const lastStyleSheet: any = document.styleSheets[i];
    try {
      lastStyleSheet.insertRule(`popper-content.question-button__popper-content > .ngxp__container[x-placement^="bottom"] {
        margin-top: 45px;
      }`);
      lastStyleSheet.insertRule(`.question-button__popper-content .ngxp__container[x-placement^="bottom"] > .ngxp__arrow {
        transform: rotate(180deg) translate(0, 80%);
      }`);
      return;
    } catch (error) {
      this.insertRules(++i);
    }
  }

  public getPopperPlace(): string {
    if (isSmallMobileDevice()) return 'bottom';
    else return 'top';
  }
}
