import { Component, Input, OnInit } from '@angular/core';

import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-scoperty-plus-navbar',
  templateUrl: './scoperty-plus-navbar.component.html',
  styleUrls: ['./scoperty-plus-navbar.component.css']
})
export class ScopertyPlusNavbarComponent implements OnInit {

  @Input() activeStepIndex: number = 0;

  isMobileDevice$ = isMobileDevice$;

  get index(): number {
    return this.activeStepIndex < 6
      ? 1
      : this.activeStepIndex < 9
        ? 2
        : 3;
  }

  constructor() { }

  ngOnInit() {
  }

}
