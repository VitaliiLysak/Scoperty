import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractPageComponent } from '../../../../shared/components/abstract-page/abstract-page.component';

const ANCHORS = {
  teamBlock: 'team',
  contactBlock: 'contact'
};

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: [
    './about.component.css',
  ],
})
export class AboutComponent extends AbstractPageComponent {
  public _name: string = 'about-page';

  protected _url: string = '/about';
  protected _anchorAliases: Map<string, string> = new Map(Object.entries(ANCHORS));

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
  ) {
    super(activatedRoute, router);
  }
}
