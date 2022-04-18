import {
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: 'ng-template[appTabsHeaderTab]',
  exportAs: 'appTabsHeaderTab',
})
export class TabsHeaderTabDirective {
  @Input() name: string;

  constructor(public template: TemplateRef<any>) {
  }
}
